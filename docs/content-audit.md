# Content audit — sooth.dev v2

Claim-by-claim evidence for every verifiable sentence in `src/content/**` on
`feat/portfolio-v2`. Each row names the claim as it appears on the page and the source that
supports it. Evidence is either a line range in the read-only research set
(`/home/mauro/portfolio-research/`, abbreviated `research/…`), a pull request, a commit SHA, or a
public repository path.

Where a per-project deep-dive and the repository total disagree, `research/00-index.md` wins: spec
correction #3 froze that file as the authority for commit counts. The `/about` page is owned by the
code implementer (`SOOT-28`), but its claims are audited here because a misattribution on that page
is exactly what this file exists to prevent.

Rules applied:

- A claim that could not be evidenced was removed or softened. Softened claims are recorded below
  with the weaker wording that shipped.
- Vendor-authored work (Boloney's ZK proofs, Bot Busters' bot AI) is named as someone else's in the
  same paragraph that mentions it.
- Client work is genericised (`The Grid` is described as "a Web3 data platform"; no account IDs,
  hostnames, ARNs, registry paths or cost figures) and marked `status: private`.
- No number appears on the site unless it is in `research/` or in a commit.

Routes owned by the code implementer (`/`, `/projects`, `/blog`, `/404`, RSS, sitemap) are out of
scope for this file; this branch touches only `src/content/**` and `docs/content-audit.md`. `/about`
is the one exception: its claims are audited below because the audit had no `/about` section, which
is how an unattributed claim survived the first review.

---

## /projects/aztecscan

| Claim on the page | Evidence |
|---|---|
| Aztec is a privacy-focused L2 on Ethereum; the explorer shows state the chain hides | `research/01-aztec-scan.md:12-18` |
| Wire formats, contract artifacts and DB schema moved for the whole engagement | `research/01-aztec-scan.md:26-30` |
| Five environments: local, staging, three live networks | `research/01-aztec-scan.md:344` |
| Three live networks ran different protocol versions on purpose | `research/01-aztec-scan.md:138-145` |
| I was the second engineer, joining about a month after the repo started, for 21 months | `research/01-aztec-scan.md:5`, `:16` |
| 678 of 1,812 commits (~37%) | `research/01-aztec-scan.md:338-339` |
| 133 authored PRs, 128 merged | `research/01-aztec-scan.md:341` |
| I was not the project lead; Filip started the repo and has ~1,005 commits | `research/01-aztec-scan.md:39-47` |
| Per-service CI/CD workflows: 10–15 commits each from me vs ~1 from others | `research/01-aztec-scan.md:47` |
| Production manifests for six named services | `research/01-aztec-scan.md:46` |
| CI/CD migration PR #625, +4,925 / 79 files | `research/01-aztec-scan.md:49`; `aztec-scan/chicmoz#625` |
| `docs/ci-cd-migration.md` is 459 lines | `research/01-aztec-scan.md:49` |
| `.opencode/agents/devops.md` is 296 lines, two commits, sole author | `research/01-aztec-scan.md:50`, `:288` |
| `claude.yml` has four commits, all mine | `research/01-aztec-scan.md:50`, `:270` |
| 10+ Aztec version bumps from `0.81.0` to `4.2.0-aztecnr-rc.2` | `research/01-aztec-scan.md:51`, `:348` |
| DB schema is primarily Filip's: ~99 touches vs my ~41, mine in migrations `0032`–`0035` | `research/01-aztec-scan.md:56` |
| README architecture diagram is Filip's | `research/01-aztec-scan.md:58` |
| `/l2/tips` canary is Filip's; I built the endpoint it monitors | `research/01-aztec-scan.md:60` |
| Before: flat Skaffold configs, scripts rebuilt every service, no layer cache | `research/01-aztec-scan.md:113-118` |
| After: `services/<name>/k8s/{base,overlays}`, path-filtered workflow, `kubectl apply -k` deploy | `research/01-aztec-scan.md:119-127` |
| `explorer-ui-v2` was the live pilot; old pipeline kept deploying the other seven | `research/01-aztec-scan.md:124` |
| `nameSuffix` does not rewrite `HTTPRoute.spec.rules[].backendRefs[].name` | `research/01-aztec-scan.md:129-131` |
| `.dockerignore` deny-then-allowlist breaks new service builds with `Cannot read file '.../tsconfig.json'` | `research/01-aztec-scan.md:132-134` |
| Nine services with their own Dockerfile | `research/01-aztec-scan.md:342` |
| Eleven shared workspace packages | `research/01-aztec-scan.md:343` |
| 37 SQL migrations | `research/01-aztec-scan.md:214` |
| Branch-to-network mapping (`production` → mainnet, `production-testnet` → testnet, `production-devnet` → devnet) | `research/01-aztec-scan.md:137` |
| Registry layer caching and `workflow_dispatch` manual redeploy | `research/01-aztec-scan.md:125-127` |
| Three networks still on independent Aztec versions | `research/01-aztec-scan.md:138-145` |
| The `kustomize build` output in the artefact | Reproduced locally with `kustomize v5.4.3`; the pattern is documented at `research/01-aztec-scan.md:129-131` |
| **Not claimed:** production scale (blocks indexed, requests/day, websockets) | Not in git: `research/01-aztec-scan.md:356-358` |
| **Not claimed:** "~30k Kafka round trips" figure | Commit-message only, marked CLAIMED: `research/01-aztec-scan.md:354`; omitted from this page |

---

## /projects/okutama

| Claim on the page | Evidence |
|---|---|
| The backend was AWS Lambda + App Runner, provisioned by hand-run AWS CLI scripts | `research/04-okutama.md:19`, `:44-68` |
| No GitOps, no shared cluster, no environment separation, no local development story | `research/04-okutama.md:19-28`, `:44-68` |
| I founded the repo: first commit `80a117e`, first production deploy the same day | `research/04-okutama.md:72-78` |
| 342 of 1,963 commits and 40 PRs; second-largest contributor | `research/04-okutama.md:4`, `:73`, `:423-424` |
| First two services: `user-management-api`, `media-management-api` | `research/04-okutama.md:76-77` |
| PR #17, +37,766/−80 across 196 files | `research/04-okutama.md:80`; `The-Grid-Data/okutama#17` |
| PR #17 moved the app onto the cluster, introduced ArgoCD, bootstrapped migrations, added Hasura DDN configs | `research/04-okutama.md:144-157` |
| Ingress migration in all three environments: PRs #13, #37, #38 | `research/04-okutama.md:81` |
| Per-service CI workflows and ArgoCD application manifests | `research/04-okutama.md:85` |
| MCP Server Phase A: PRs #495–#502 | `research/04-okutama.md:83`; `The-Grid-Data/okutama#495` |
| ADR-0008 and its self-review: PR #498 | `research/04-okutama.md:84`; `The-Grid-Data/okutama#498` |
| The Unified Permissions System is a teammate's build | `research/04-okutama.md:89-90` |
| The Aurora MySQL schema series is a teammate's work | `research/04-okutama.md:92` |
| Final nginx removal is someone else's commit (`c3c00ba`) | `research/04-okutama.md:93`, `:139` |
| Local + staging cut over in PR #13; production ten days later in PR #38 | `research/04-okutama.md:130-138` |
| Old nginx path stayed ~10 weeks after production cutover | `research/04-okutama.md:139`, `:433` |
| Staging runs single-node K3s and cannot rehearse an EKS control-plane upgrade | `research/04-okutama.md:194-195` |
| 12 services | `research/04-okutama.md:429` |
| 8 ADRs | `research/04-okutama.md:400` |
| ~35 dated design documents | `research/04-okutama.md:402` |
| Deploy frequency 6 in January 2026 to a peak of 70 in July 2026 | `research/04-okutama.md:221-232`, `:432` |
| Local stack cold start ~10 minutes | `research/04-okutama.md:237-242` |
| ArgoCD + Kustomize, staging auto-sync, production manual gate | `research/04-okutama.md:175` |
| Docs said `t3.medium` and Hetzner; live was `t3.large` on EC2 | `research/04-okutama.md:201-206`, `90-cross-cutting.md:92-103` |
| The same audit found an ADR naming a migration tool not imported in the repo (Tern) | `research/04-okutama.md:296-297` |
| ArgoCD resources ordered by sync wave | `research/04-okutama.md:210-214` |
| **Softened:** client name, cost figures and ADR cost delta | Withheld per `research/04-okutama.md:483-486`, `:387-392`; spec Q7. The page says "a Web3 data platform" and publishes no cost |
| **Not claimed:** cost before/after migration, latency, request volume | Not in the repo: `research/04-okutama.md:440-441` |

---

## /projects/bot-busters

| Claim on the page | Evidence |
|---|---|
| Players and 1–3 LLM bots in a group chat; everyone votes after a timed chat round | `research/02-bot-busters.md:10-21`, `:288-289` |
| The server owns stage transitions, vote validity, scoring and player absence | `research/02-bot-busters.md:86-106` |
| I joined a month in, worked ~4.5 months, Oct 2023 – Feb 2024 | `research/02-bot-busters.md:10`, `:42`, `:278` |
| 44 commits (of 355 repo-wide); 43 of the repo's 254 PRs; third-largest contributor | `research/00-index.md:62` (commit total and his), `research/02-bot-busters.md:5`, `:45`, `:276` (PR split). The page no longer implies 254 is a commit total |
| `match.ts` is my top file at 13 commits | `research/02-bot-busters.md:54`, `:280` |
| `vote()` and `calculatePoints()` are in `match.ts` | `research/02-bot-busters.md:102-107` |
| Achievements: 8 of 9 commits, PRs #143–#307 | `research/02-bot-busters.md:55`, `:112-119` |
| DB access extraction: PR #64 | `research/02-bot-busters.md:57`; `Kryha/bot-busters#64` |
| `user_match` join table: PR #171 | `research/02-bot-busters.md:58`; `Kryha/bot-busters#171` |
| Anonymous + wallet auth in `auth.ts` | `research/02-bot-busters.md:60`, `:123-129` |
| Profanity filter and 150-character message cap (PR #291) | `research/02-bot-busters.md:59`, `:61` |
| The bot AI is Ramiro's: `agent.ts` 14/14 commits; personality matrix too | `research/02-bot-busters.md:66-71`, `:196-198` |
| The schema is co-authored with Marius | `research/02-bot-busters.md:70-71` |
| The later on-chain leaderboard and payouts are not mine | `research/02-bot-busters.md:74-78` |
| `toSerializable()` strips `isBot` until results; one shuffled identity pool | `research/02-bot-busters.md:92-106` |
| 3 min chat / 30s voting / 6.5s splash / 10 min TTL | `research/02-bot-busters.md:288` |
| Bots capped at `min(3, PLAYERS_PER_MATCH)` | `research/02-bot-busters.md:289` |
| One test file; CI deploys every push with no test or lint gate | `research/02-bot-busters.md:284-285`, `:161` |
| **Not claimed:** player counts, matches/day, uptime | Not visible from source: `research/02-bot-busters.md:290-291` |
| **Not claimed:** Bedrock cost/volume | `research/02-bot-busters.md:291` |

---

## /projects/boloney

| Claim on the page | Evidence |
|---|---|
| Liar's Dice as a realtime multiplayer game, built as an Aleo ZK showcase | `research/03-boloney.md:9-20` |
| The game needs auth, wallet identity, a match loop and turn timers before a proof layer plugs in | `research/03-boloney.md:9-20`, `:98-113` |
| One of six regular contributors over ~10 months | `research/03-boloney.md:12-13`, `:59-61` |
| 87 of 1,228 commits (~7%) | `research/00-index.md:63` is the authority (spec correction #3); `research/03-boloney.md:13` carries his count. The deep-dive's own 1,209 total (`03:4`, `:241`) is stale and is not used |
| Match state machine generations 1 and 2: `44a6389a` → `91372108` → `f8d932e7` | `research/03-boloney.md:70`, `:99-106` |
| Timer service `2f42a6cd`, 96 lines | `research/03-boloney.md:71`, `:104` |
| Notification system `bfedc840` | `research/03-boloney.md:72` |
| Six power-ups, full-stack, with the named commits | `research/03-boloney.md:73`, `:76` |
| Aleo wallet auth built twice: `a34fe1d8`, `4f922908` | `research/03-boloney.md:74` |
| 3D dice UI and audio (`61b1ca82`) | `research/03-boloney.md:76`, `:141-153` |
| Die/PowerUp components and original Rollup config (`33cccd82`) | `research/03-boloney.md:77` |
| The ZK proofs/circuits are a sibling repo with 1 of my 107 commits | `research/03-boloney.md:22-30`, `:244` |
| Commit-reveal hash-chain RNG and ZK plumbing are teammates' | `research/03-boloney.md:32-47`, `:85` |
| The third-generation `stage-handlers.ts` refactor is not confirmed mine | `research/03-boloney.md:88`, `:106` |
| I removed the placeholder public random-number API roller twice, nine months apart | `research/03-boloney.md:52-55` |
| Per-stage timeouts: 30s for power-up/dice-roll/round-summary, 60s for a turn | `research/03-boloney.md:98-113` |
| `handleOutOfTime` auto-rolls, force-advances or forfeits | `research/03-boloney.md:109-113` |
| Stock `heroiclabs/nakama:3.13.1` with Rollup-bundled modules; 7 backend test files | `research/03-boloney.md:96`, `:247` |
| No GitHub PRs exist because GitHub is an Azure DevOps mirror | `research/03-boloney.md:209-221`, `:250` |
| **Not claimed:** player counts, concurrent matches, uptime | Not in git: `research/03-boloney.md:253-255` |
| **Not claimed:** generation-3 state machine ownership | Uncertain: `research/03-boloney.md:88`, `:105-106` |

---

## /projects/olla

| Claim on the page | Evidence |
|---|---|
| Olla Finance is a liquid staking protocol for Aztec | owner-asserted: `public/cv.md:57-63` |
| A three-developer team | owner-asserted: `public/cv.md:59` |
| I owned the frontend | owner-asserted: `public/cv.md:59` |
| 70 commits under my GitHub handle in `ollafinance/olla-ui` | GitHub API, `author=Mautjee`, checked 2026-10-27 (recorded in `research/01-aztec-scan.md:193-197` context; the count is from the public API) |
| Go backend services and data pipelines | owner-asserted: `public/cv.md:59-61` |
| The infrastructure is the same design as the block explorer, isolated, on shared hardware | owner-asserted: `public/cv.md:61`; `research/01-aztec-scan.md:193-197` |
| **Softened:** "Some of this is owner-asserted rather than audited" | Stated on the page; there is no `05-olla.md` in the research set (`research/00-index.md:38-46`) |
| **Not claimed:** users, TVL, uptime, audit outcomes | No source: `research/01-aztec-scan.md:193-197` |
| **Not claimed:** a specific hard-part decision beyond the shared-platform choice | `research/01-aztec-scan.md:196-197` leaves the role open; the weaker platform claim is `public/cv.md:61` |
| **Omitted artefact** | No verifiable snippet exists (`research/00-index.md:38-46`); an illustrative diagram was rejected. Recorded in the PR |
| **Deviation from AC-13, deliberate:** page is 573 words against the 600-word floor | This is a GAP page: there is no `05-olla.md`, the claims are owner-asserted, and padding it to clear a word count would add unevidenced prose. Quality accepted this as the correct call for a GAP page. The audit records it here so the deviation is visible to every later reader. No padding was added |

---

## /blog/agents-near-production

| Claim on the page | Evidence |
|---|---|
| An agent needs conventions in writing, a governed data path, and a human gate | Thesis, synthesis of `research/90-cross-cutting.md:11-45` |
| `devops.md`: 296 lines, two commits, both mine | `research/01-aztec-scan.md:50`, `:288` |
| PR #612: six skill guides + six agent personas, ~2,055 lines | `research/01-aztec-scan.md:283-289`; `aztec-scan/chicmoz#612` |
| `claude.yml`: four commits, all mine, used on PR #525 | `research/01-aztec-scan.md:270-275`; `aztec-scan/chicmoz#525` |
| Delegated fixes to Copilot on PRs #540 and #622, then asked it to self-verify | `research/01-aztec-scan.md:277-281`; `aztec-scan/chicmoz#540`, `#622` |
| PR #540 replaced a full-table scan with `inArray(...)` and collapsed an N+1 | `research/01-aztec-scan.md:279-281` |
| Before the MCP server: anonymous reads, bespoke write routes, no external connections | `research/04-okutama.md:332-338` (PRD quote) |
| Grid MCP Server: PRs #495–#502, UPS-authenticated, delegating to go-backend | `research/04-okutama.md:83`, `:332-348` |
| Stateless streamable HTTP, SIGTERM drain test | `research/04-okutama.md:340-348` |
| Auth chain: credential exchange → JWKS verify → token cache → middleware | `research/04-okutama.md:344-348` |
| Fail-closed rule: throw on non-200, never fall back to the input credential | `research/04-okutama.md:301-303` |
| Mint route rate limit 5 rps, burst 10, 10-minute idle TTL | `research/04-okutama.md:280-286` |
| Five-second default outbound timeout | `research/04-okutama.md:299-300` |
| Anthropic API rejects top-level `anyOf`/`oneOf`/`allOf`; validation moved to the handler and described to the model | `research/04-okutama.md:350-357` |
| Production deployments kept a manual ArgoCD gate while staging auto-synced | `research/04-okutama.md:175` |
| A mainnet playbook requiring the exact hostname is a pattern I worked within, not my code | `research/01-aztec-scan.md:66-70`; `research/90-cross-cutting.md:31` |
| **Not claimed:** any specific incident outcome or scale number | No source in the research set |

---

## /blog/ci-cd-service-by-service

| Claim on the page | Evidence |
|---|---|
| Before: flat Skaffold configs, scripts rebuilt every service on every push, no layer cache, no shared base | `research/01-aztec-scan.md:113-118` |
| After: `services/<service>/k8s/{base,overlays}`, one path-filtered workflow, `kubectl apply -k` deploy | `research/01-aztec-scan.md:119-127` |
| `explorer-ui-v2` was the live pilot; the old pipeline deployed the other seven | `research/01-aztec-scan.md:121-124` |
| PR #625, +4,925 / 79 files | `research/01-aztec-scan.md:49`; `aztec-scan/chicmoz#625` |
| Branch-to-network mapping | `research/01-aztec-scan.md:137` |
| GHA layer caching to the registry; `workflow_dispatch` | `research/01-aztec-scan.md:125-127` |
| `nameSuffix` does not rewrite `HTTPRoute` backendRefs | `research/01-aztec-scan.md:129-131` |
| `.dockerignore` failure: `Cannot read file '.../tsconfig.json'` | `research/01-aztec-scan.md:132-134` |
| The `kustomize build` output in the post | Reproduced locally with `kustomize v5.4.3`; pattern from `research/01-aztec-scan.md:129-131` |
| Migration took months and carried two pipelines | `research/01-aztec-scan.md:121-125` |
| `docs/ci-cd-migration.md` is 459 lines | `research/01-aztec-scan.md:49` |
| **Not claimed:** zero-downtime or a specific number of incidents | No source |
| **Not claimed:** the old pipeline was deleted by me | It was retired progressively (`research/01-aztec-scan.md:124`); no claim is made about the final removal |

---

## /blog/documentation-drift

| Claim on the page | Evidence |
|---|---|
| Docs said `t3.medium`; live was `t3.large` | `research/04-okutama.md:202`, `:434` |
| Docs said staging was Hetzner `t3.xlarge`; live was AWS EC2 `t3.2xlarge` | `research/04-okutama.md:202`, `:434` |
| ADR-0002 said `pgx` + Tern; the repo has a hand-rolled migration runner and no Tern | `research/04-okutama.md:296-297` |
| The fixing commit is titled "correct stale cluster facts" | `research/04-okutama.md:202`; `research/90-cross-cutting.md:98` |
| The audit happened while writing a decision record about a Kubernetes version leaving support | `research/04-okutama.md:359-370` |
| Some controllers were already outside the supported range, forcing controllers-first sequencing | `research/04-okutama.md:370-386` |
| **Not claimed:** the EKS cost figures and the $4,320/year delta | Withheld (client sign-off): `research/04-okutama.md:359-386`; spec Q7 |
| **Not claimed:** ADR-0008 was approved and executed | It lives on an unmerged branch: `research/04-okutama.md:387-392` |
| **Softened:** "a decision with real money on it" | Matches `research/04-okutama.md:39` without publishing the figure |

---

## /blog/parallel-run

| Claim on the page | Evidence |
|---|---|
| The Grid: ingress one environment at a time; PR #13 then PR #38 ten days later | `research/04-okutama.md:130-138` |
| Old nginx stayed ~10 weeks after the production cutover | `research/04-okutama.md:139`, `:433` |
| Old deployment topologies kept as `-deprecated` manifest sets, still present | `research/04-okutama.md:172-180`; `research/90-cross-cutting.md:57` |
| Aztecscan: one service at a time, `explorer-ui-v2` pilot, old pipeline deployed the rest | `research/01-aztec-scan.md:121-124` |
| Aztecscan: ingress one network at a time (devnet, testnet, mainnet) | `research/01-aztec-scan.md:138-145` |
| EKS 1.33 → 1.35 **proposal**: controllers first, then one minor version at a time with verification | `research/04-okutama.md:370-386`; **not executed** — ADR-0008 lives on the unmerged branch `DEV-5205-check-whether-eks-1-33-upgrade` (`research/04-okutama.md:387-392`). The artefact table row is marked "proposed, not executed" and the timeline intro separates it from the four shipped migrations |
| **Softened:** the last column ("old path removed") for the Aztecscan ingress row says "in progress when I left" | `research/01-aztec-scan.md:145` describes it as rolling out network by network |
| **Not claimed:** durations, outage counts or incident numbers beyond the documented 10 days / 10 weeks | No other source |

---

## /blog/local-dev-environment

| Claim on the page | Evidence |
|---|---|
| One command: `./scripts/setup.sh k8s --setup --preset full` | `research/04-okutama.md:177` |
| `full` = 6 CPU / 12 GB; `minimal` = 4 CPU / 8 GB | `research/04-okutama.md:196-197` |
| Cold start ~10 minutes | `research/04-okutama.md:237-242` |
| Images built locally, `push: false`, `useBuildkit: false` | `research/04-okutama.md:196-199` |
| Build context one level above the service so a Dockerfile can reach a sibling shared package | `research/04-okutama.md:196-199` |
| Restores a weekly sanitized staging snapshot with PII stripped | `research/04-okutama.md:237-242` |
| Three attachable frontends from a sibling checkout | `research/04-okutama.md:239-241` |
| A dozen services / full multi-service stack | `research/04-okutama.md:429` |
| Minikube, not EKS | `research/04-okutama.md:196-198` |
| **Genericised:** no client name, hostnames, ARNs, account IDs, or internal service names | Drafted from `research/04-okutama.md:237-242`; the gate in `research/91-content-backlog.md:25` is satisfied by genericisation (spec correction 5) |
| **Removed (F9):** the `Cannot read file '.../tsconfig.json'` failure | That failure is Aztecscan's `.dockerignore` allowlist story (`research/01-aztec-scan.md:132-134`), not this platform's. The sentence was cut here; `/blog/ci-cd-service-by-service` carries it where it belongs |
| **Not claimed:** a literal terminal transcript of a specific run | Not recorded in the research set; the post shows the real command interface and the documented cold-start figure, not invented output |

---

## /blog/gateway-api-migration

| Claim on the page | Evidence |
|---|---|
| nginx-ingress → Envoy Gateway on the Gateway API, one environment at a time | `research/04-okutama.md:128-139` |
| Local + staging in PR #13; production in PR #38 ten days later | `research/04-okutama.md:130-138` |
| Old nginx path stayed ~10 weeks after the cutover | `research/04-okutama.md:139` |
| Upload endpoint returned 413 until the body limit was raised | `research/04-okutama.md:134` |
| CORS enforced upstream by the Gateway `SecurityPolicy`, not app code | `research/04-okutama.md:269-274` |
| Staging on K3s cannot rehearse an EKS control-plane upgrade | `research/04-okutama.md:194-195` |
| `nameSuffix` does not rewrite `HTTPRoute` backendRefs | `research/01-aztec-scan.md:129-131` |
| GatewayClass / Gateway / HTTPRoute role split | Kubernetes Gateway API documentation; implementation used was Envoy Gateway (`research/04-okutama.md:128-139`) |
| The YAML shapes in the artefact | Standard Gateway API `v1` resources; hostnames sanitised. No client values |
| **Genericised:** all hostnames, namespaces, service names | Sanitised; source detail at `research/04-okutama.md:128-139` |
| **Not claimed:** a specific controller version or a live command transcript | Not recorded in the research set |

---

## /blog/fresh-clone-bugs

| Claim on the page | Evidence |
|---|---|
| The three bugs were found by cloning and running against an empty database, in PR #364 | `research/01-aztec-scan.md:315-321`; `aztec-scan/chicmoz#364` |
| FK violation: contract-instance data referenced a contract class not yet stored | `research/01-aztec-scan.md:316-317` |
| The duplicate-write log line: "Fresh clone logs storing block two times…" | `research/01-aztec-scan.md:318` |
| `ZodError: expected object, received array` on `body.txEffects[0].contractClassLogs` | `research/01-aztec-scan.md:320` |
| The Zod failure was the new protocol wire format against the frontend's runtime schema | `research/01-aztec-scan.md:320-321` |
| 13 test files across ~80,000 lines of TypeScript | `research/01-aztec-scan.md:255` |
| The PR workflow's lint step was commented out | `research/01-aztec-scan.md:255` |
| 37 SQL migrations, five environments | `research/01-aztec-scan.md:214`, `:344` |
| Event-driven pipeline: listeners → Kafka → API → Postgres | `research/01-aztec-scan.md:204-214` |
| **Not claimed:** production user impact or a production incident | The research records a fresh-clone reproduction, not a production outage: `research/01-aztec-scan.md:315-321` |
| **Not claimed:** a measurement of how long each bug existed | No source |

---

## /about

Owned by the code implementer (`src/pages/about.astro`), audited here because its absence from the
first audit is how an unattributed claim survived Quality's review (F3). Wording below matches the
page after the F3 correction, which is `SOOT-28`'s change: "I built the first two; the third I
worked within."

| Claim on the page | Evidence |
|---|---|
| Platform and infrastructure engineer who takes prototypes to production | Self-description, backed by the role/period of every project page; no number claimed |
| Works across Go and TypeScript services, Kubernetes, CI/CD | `public/cv.md:110-118` (skills); Go services in `research/04-okutama.md:144-157`; TypeScript services in `research/01-aztec-scan.md:26-30` |
| Freelancing since 2024 | `public/cv.md:21-23` (`Jul 2024 – Present`) |
| Mostly teams whose product had outgrown its deployment | Framing, evidenced by the two client engagements: `research/04-okutama.md:19-28` (unmanaged Lambda/App Runner) and `research/01-aztec-scan.md:113-127` (per-service CI/CD) |
| Aztecscan shipped more than ten protocol versions while he was there | `research/01-aztec-scan.md:51`, `:348` |
| Three live networks ran different protocol versions on purpose | `research/01-aztec-scan.md:138-145` |
| Wrote about a third of the Aztecscan codebase | `research/00-index.md:58` (678 of 1,812); `research/01-aztec-scan.md:17`, `:339` |
| Owned the CI/CD and production manifests | `research/01-aztec-scan.md:46-49`, `:106` |
| The Grid was unmanaged Lambda + App Runner with no environment separation | `research/04-okutama.md:19-28`, `:44-68` |
| Rebuilt it as a Kubernetes platform, environment by environment | `research/04-okutama.md:128-157` |
| Owned the match state machine in both Bot Busters and Boloney | `research/02-bot-busters.md:54`; `research/03-boloney.md:70`, `:99-106` |
| A 459-line CI/CD migration plan | `research/01-aztec-scan.md:49`; `research/90-cross-cutting.md:73` |
| A 373-line ingress migration plan | `research/01-aztec-scan.md:74` |
| An ADR that compared four rejected options before recommending one | `research/04-okutama.md:359-386` |
| Reviewed his own decision record in the critical/important/suggestion taxonomy | `research/04-okutama.md:84`; PR #498 |
| Kept the old path until the new one was proven; `-deprecated` manifests still present | `research/04-okutama.md:172-180`; `research/90-cross-cutting.md:53-59` |
| The ten-week gap between the Envoy cutover and removing nginx | `research/04-okutama.md:139`, `:433`. The final removal commit is someone else's (`04:93`); the page praises the gap, not authorship of the removal |
| Agent conventions in writing; one governed data path; human confirmation before irreversible work | First two are his: `research/01-aztec-scan.md:50`, `:288` (`.opencode/agents/devops.md`, PR #612); `research/04-okutama.md:83`, `:332-348` (MCP server, PRs #495–#502). **The human-confirmation interlock is Filip's**: `research/01-aztec-scan.md:66-70`, `research/90-cross-cutting.md:39-41`. The F3 sentence was corrected to "I built the first two; the third I worked within" |
| "Open to freelance platform and infrastructure work" | Owner decision, 2026-10-27 (SOOT-29 decision record), not a factual claim about the past |
| Contact links (`mailto:sooth.dev@gmail.com`, GitHub, LinkedIn, CV) | `public/cv.md:11-14` for identity and LinkedIn; the email is the owner-provided public contact. No phone, address or birth date appears |

---

## What was deliberately not written

Backlog items #2, #3, #5, #6, #7, #12, #14 and #15 were not written. Each is gated on client
sign-off, cost figures, attribution answers or an unresolved factual question
(`research/91-content-backlog.md:21-47`; spec §7). No gated idea appears in any post.

## Numbers that were considered and dropped

| Candidate number | Why it is absent |
|---|---|
| Aztecscan production scale (blocks, requests, websockets) | Not in git: `research/01-aztec-scan.md:356-358` |
| ~30k Kafka round trips per event | Commit-message claim only, marked CLAIMED: `research/01-aztec-scan.md:354` |
| The Grid cost figures and EKS delta | Client sign-off outstanding: `research/04-okutama.md:483-486`; spec Q7 |
| Bot Busters players/matches/day/uptime | Not visible from source: `research/02-bot-busters.md:290-291` |
| Boloney player/concurrent-match numbers | Not in git: `research/03-boloney.md:253-255` |
| Olla users/TVL/uptime | No source: `research/01-aztec-scan.md:193-197` |
| Boloney "1,209 commits" denominator | Stale deep-dive total; replaced with `1,228` from `research/00-index.md:63` (F6) |
| Bot Busters "out of 254" | 254 is the repo's PR total, not a commit total; relabelled "43 of the repo's 254 pull requests" (F7) |
