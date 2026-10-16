# Engineering instructions

- Preserve unrelated projects, previews and browser saves. Work only in this repository.
- Keep cartoon operations in src/model.ts pure and separate from rendering and storage.
- Use strict TypeScript, no runtime dependencies, and original assets only.
- Treat docs/spec.md as the scope and docs/sources.md as the fidelity evidence. State approximations honestly.
- Verify meaningful authoring, playback, and persistence behavior through public model operations and visible browser controls.
- Run typecheck, unit tests, production build and browser tests before publishing.
- Preview only on loopback, with an inspected free strict port; never stop unrelated processes.
- Do not commit credentials, private material, caches or generated build/test outputs.
