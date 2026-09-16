# Parallel Proof Development Workflow

## Goal

Ten developers should be able to implement ten proofs at the same time and merge them in any order. Parallel safety comes from file ownership, automatic discovery, and a stable shared API.

## Repository boundaries

```text
app/
├── proof-engine/                         shared, versioned interaction API
├── components/VisualProofShell.*        shared, stable page chrome
├── proof-status/
│   └── <catalog-id>.json                one unique file per proof
└── visual-proofs/
    ├── [category]/[slug]/                generic catalog fallback
    └── <category>/<proof-slug>/          one isolated implementation
        ├── page.tsx                      route entry
        ├── Proof.tsx                     interaction and rendering
        ├── proof.config.ts               proof-local metadata/config
        ├── proof.module.css              proof-local styles
        └── assets/                       optional proof-local assets
```

Static proof directories override the generic dynamic catalog route. The catalog reads every `app/proof-status/*.json` file automatically, so no developer edits a shared registry to publish their proof.

## Branch model

Use one branch and one pull request per proof:

```text
main
├── proof/triangle-midpoint-theorem
├── proof/circle-area-rearrangement
├── proof/alternate-segment-theorem
└── proof/geometric-series-area
```

Do not create long-lived integration branches. Before review, rebase the proof branch on `main` and run the full test command. Because proof branches add unique directories and manifests, merge order should not matter.

## Starting work

First claim the catalog ID in a GitHub issue and assign one developer. This prevents two developers from starting the same proof before either branch is visible. The proof manifest provides the repository-level claim once the pull request is open.

```bash
git switch main
git pull --ff-only
git switch -c proof/<catalog-id>
npm run proof:new -- --id <catalog-id> --owner <name>
```

The scaffold refuses to overwrite an existing proof directory or manifest. If it refuses, someone has already claimed or implemented that proof; choose another catalog ID or coordinate ownership.

## Shared engine changes

Treat `app/proof-engine` as a library consumed by proofs. A missing capability such as 3D projection, multi-object docking, or constraint solving is not permission to modify the engine inside a proof pull request.

Use this sequence:

1. Describe the capability as a general engine contract.
2. Add it in a small `engine/<capability>` branch with unit tests and backwards compatibility.
3. Merge the engine pull request.
4. Rebase each proof branch and consume the new exported API.

This makes shared changes land once instead of being independently reimplemented by several developers.

## CSS and assets

Proof styles must use CSS Modules. Never add a proof slug, shape color, canvas coordinate, or proof-only responsive rule to `app/globals.css`. Keep SVGs, textures, and images under the proof's directory so deleting or moving a proof is atomic.

Prefer SVG and the shared canvas primitives for mathematical geometry. Do not use screenshots as proof content.

## Tests

Run:

```bash
npm run proof:validate
npm run test:unit
npm run build
npm test
```

Proof-specific tests belong in uniquely named files under `tests/proofs/`. Shared engine tests belong in the existing engine test suite and should accompany only engine pull requests.

## Conflict policy

If a proof pull request modifies a shared file, the author must either:

1. remove the shared change and implement through existing APIs, or
2. split the shared change into a separate engine/infrastructure pull request.

Do not resolve conflicts by accepting an entire side of `package.json`, `app/globals.css`, the catalog JSON, or engine files. Preserve both intended changes and rerun the full suite.

## Release readiness

`interactive` means the proof can be used. `verified` is stricter: all visible controls work, drag/drop works with mouse and touch, keyboard alternatives exist, the proof was checked in a real browser, and visual differences against its authoritative reference were corrected.
