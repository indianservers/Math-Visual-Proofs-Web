## Proof or infrastructure change

- Catalog proof ID:
- Proof-owned directory:
- Reference viewport (if applicable):

## Scope

- [ ] This pull request implements one proof only.
- [ ] It changes only the proof-owned directory, manifest, assets, and proof-specific tests.
- [ ] Or: this is an explicitly coordinated shared engine/infrastructure pull request.

## Verification

- [ ] `npm test` passes after rebasing on current `main`.
- [ ] Every visible control works.
- [ ] Dragging works with pointer/touch and has a keyboard alternative.
- [ ] Movable objects use understandable hover, focus, `grab`, and `grabbing` feedback.
- [ ] Reset restores a deterministic initial state.
- [ ] I compared the route with its authoritative reference at the same viewport.
- [ ] I did not add proof-specific rules to `app/globals.css`.
