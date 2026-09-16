# Contributing Visual Proofs

This repository is organized so multiple developers can build different proofs without touching the same files.

## Start one proof

1. Create a branch from current `main`: `proof/<catalog-id>`.
2. Run `npm run proof:new -- --id <catalog-id> --owner <your-name>`.
3. Work only in the generated proof directory and its matching manifest in `app/proof-status/`.
4. Run `npm test` before opening a pull request.
5. Rebase on current `main`, rerun the tests, and open one pull request for one proof.

The catalog ID is the `id` field in `app/data/visual-proofs-detailed.json`.

## Ownership boundary

A proof developer owns only:

- `app/visual-proofs/<category>/<proof-slug>/**`
- `app/proof-status/<catalog-id>.json`
- `tests/proofs/<catalog-id>.*` when proof-specific tests are added
- proof-specific assets under the proof's own `assets/` subdirectory

Do not put proof-specific CSS in `app/globals.css`. Use the generated `proof.module.css`. Do not add a proof to a central route map; the per-proof manifest is discovered automatically.

The following are shared infrastructure and should be changed only in a separate, coordinated pull request:

- `app/proof-engine/**`
- `app/components/VisualProofShell*`
- `app/lib/proofImplementation.ts`
- `app/lib/visualProofCatalog.ts`
- `app/data/visual-proofs-detailed.json`
- `app/globals.css`
- `package.json` and lockfiles
- build, lint, and CI configuration

If a proof needs an engine capability, open a small engine pull request first. Merge it, rebase the proof branch, then use the capability. Do not combine engine redesign and an individual proof in one pull request.

## Status lifecycle

- `planned`: catalog entry only; no active implementation. User-facing label: **Upcoming**.
- `in-development`: an isolated workspace exists, but should not be advertised as ready. User-facing label: **Upcoming**.
- `interactive`: controls and mathematical interactions work. User-facing label: **Interactive**.
- `verified`: interaction, accessibility, and reference-image visual checks have passed. User-facing label: **Visually verified**.

Only change the status in that proof's own manifest. `npm run proof:validate` checks manifest identity, duplicate routes, and isolated page existence.

Every catalog proof also has a unique proof-feel cue (method, interaction, and “oo yes” moment) derived in `app/lib/proofFeel.ts` so learners see *how* it is proved, not only whether it is ready.

## Merge checklist

- The pull request changes one proof-owned directory.
- The proof has no global selectors or proof-specific global state.
- Pointer, mouse, touch, and keyboard interaction work.
- Drag targets have visible hover/focus states and `grab`/`grabbing` cursors.
- Reset and every visible control work.
- The dedicated route contains no other proof.
- Visual comparison was performed at the reference viewport, when a reference exists.
- `npm test` passes after rebasing on `main`.

See [docs/PARALLEL_PROOF_WORKFLOW.md](docs/PARALLEL_PROOF_WORKFLOW.md) for the architecture and conflict-resolution policy.
