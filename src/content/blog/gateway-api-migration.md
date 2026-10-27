---
title: 'Migrating ingress to the Gateway API'
description: 'Move ingress from nginx to the Gateway API one environment at a time, keep the old path live, and avoid the failures that route traffic silently.'
pubDate: 2026-10-21
tags: [kubernetes, gateway-api, ingress, migration]
project: okutama
---

An ingress migration is not a YAML migration. It is a traffic migration. The moment you accept that,
the plan writes itself: you keep the old path serving while the new one proves itself, you move one
environment at a time, and you do not delete anything until you have lived with the replacement.

I have done this from nginx-ingress to Envoy Gateway on the Kubernetes Gateway API. The mechanics
are portable; the mistakes are worth writing down.

## Why the Gateway API at all

The old model puts everything in one Ingress object with a pile of vendor annotations. TLS, host
routing, path matching, rewrites, timeouts, body size, CORS and authentication all live in the same
document, expressed as strings that only one controller understands. Upgrading the controller means
auditing every annotation again.

The Gateway API splits the problem into roles:

- **GatewayClass** is the implementation. The platform team owns it.
- **Gateway** is a listener: a hostname, a port, a TLS certificate. The platform team owns it.
- **HTTPRoute** is application routing: paths, backend references, filters. The service team owns it.

That split is the reason to migrate. A service team can add a route without editing the platform's
ingress, and the platform can change the implementation without rewriting application routing. The
cost is that the ecosystem is younger, and some nginx behaviour has to be re-expressed rather than
copied.

## Step zero: inventory the annotations

The migration fails or succeeds on the inventory. Before writing a single HTTPRoute, list every
thing the old ingress does:

| Behaviour | nginx location | Gateway API equivalent |
|---|---|---|
| Host and path routing | `server_name`, `location` | HTTPRoute `hostnames`, `matches` |
| TLS termination | `tls.secretName`, annotations | Gateway listener `certificateRefs` |
| Request body size | `proxy-body-size` | implementation-specific policy |
| Timeouts | `proxy-read-timeout` | HTTPRoute `timeouts` / policy |
| CORS | annotations on the ingress | `SecurityPolicy` at the gateway |
| Rewrites | `rewrite-target` | HTTPRoute `filters` |
| Auth | annotations or sidecar | `SecurityPolicy` / external auth |

Two of those rows caused real work in my migration.

The first is **body size**. An upload endpoint that worked behind nginx returned 413 behind the new
gateway until the limit was raised in the right policy. That is a boring bug with an obvious fix,
and it is exactly the kind of thing an inventory catches before a cutover. The old path was still
serving, which is how we found it without an outage.

The second is **CORS**. The application had environment-conditional CORS middleware: permissive in
local and development, strict in production. The strict part was enforced upstream by the gateway's
security policy, not by application code. That is a good separation, but it means the migration had
to carry the CORS rules across, not just the routes. An HTTPRoute that matches perfectly and a
gateway that drops the preflight request is still a broken API.

## Step one: run both controllers

You do not have to choose which controller serves a hostname at migration time. Run both. The old
nginx ingress keeps its load balancer and its rules. The new Gateway gets its own address. Move one
hostname or one path at a time by changing where that name resolves or which route matches it.

That is what parallel-run means at the ingress layer. Both paths are real, both are reachable, and
the rollback is a routing change rather than a redeploy.

We moved local and staging first, in one pull request, because local and staging are where a wrong
route costs nothing. Production followed ten days later, and the old nginx path stayed installed for
roughly ten weeks after that. The ten weeks were not indecision. They were the window in which we
could compare behaviour and move the last clients.

## Step two: one environment at a time

The environment is the unit. Not the hostname, not the route.

The reason is that environments differ in ways that matter to ingress: certificate issuer, DNS,
load balancer implementation, and the number of people depending on the endpoint. A change that is
safe in staging can still be wrong in production because production has a different controller
version or a different TLS setup.

The staging environment in this platform ran a single-node K3s cluster, which cannot rehearse an EKS
control-plane upgrade. It could rehearse the ingress change, and that was enough for this migration.
It is not enough for a cluster-version migration, and pretending otherwise is how a staging
environment gives you false confidence.

## The failures that route silently

Ingress bugs are worse than application bugs because the application is not involved. A route that
points at a service that does not exist still returns a response from the proxy, often a 503 with no
application log line.

Two of those are worth memorising.

**A rename transform that does not rewrite references.** If your overlay adds a `nameSuffix` to a
Service, Kustomize does not rewrite `HTTPRoute.spec.rules[].backendRefs[].name`. The route applies
cleanly and points at the old name. Grep the rendered manifests for the old name, not the source.

**A default backend that hides a missing route.** A catch-all route to a fallback service will return
200 for a path you thought was matched by a specific rule. Check the route's status conditions and
the gateway's attached routes, not just the response code.

The general rule: after every manifest change, render the manifests and read the rendered output.
Reviewing the source is reviewing the input; the bug lives in the output.

## What it cost

Two ingress stacks for ten weeks. Two sets of certificates, two sets of routing configuration, two
places to look when a request failed. Alerting had to cover both. A change to a shared header or a
TLS setting had to be made twice or deliberately deferred.

The migration also had a long tail of annotation parity. Every annotation that had accumulated over
the life of the old ingress was a small question: is this still needed, and what is the equivalent?
Most of them were not needed. Finding that out took longer than writing the new routes.

## What I'd do differently

I would build the annotation parity table before the first cutover and make it the checklist for
each environment. Ours existed as a set of discoveries during the migration, which meant the second
environment repeated some of the first environment's surprises.

I would also write the deletion date for the old controller on the day of the production cutover. A
ten-week tail is healthy. A tail with no owner and no date becomes permanent infrastructure, and then
the next migration has two old paths to remove.

## What to steal

- Treat it as a traffic migration, not a manifest rewrite.
- Inventory every annotation before writing routes.
- Run both controllers and move one hostname or path at a time.
- Move one environment at a time; production last.
- Grep the rendered output for old names after any rename transform.
- Put a date on deleting the old path.

## Artefact

The two resources that replace an annotated nginx Ingress: a Gateway listener owns TLS, and an
HTTPRoute owns application routing. Sanitised hostnames.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: public
  namespace: platform
spec:
  gatewayClassName: envoy-gateway
  listeners:
    - name: https
      port: 443
      protocol: HTTPS
      hostname: "api.example.com"
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: api-example-tls
```

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: orders-api
  namespace: orders
spec:
  parentRefs:
    - name: public
      namespace: platform
  hostnames:
    - "api.example.com"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /v1/orders
      backendRefs:
        - name: orders-api
          port: 80
```

The `backendRefs` name is the one to check by hand after any transform. It is the line that fails
without failing.
