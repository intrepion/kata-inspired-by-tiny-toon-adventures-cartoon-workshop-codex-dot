# Pocket Picture Workshop

An original browser cartoon studio closely inspired by the **authoring workflow** of *Tiny Toon Adventures: Cartoon Workshop* (NES, 1992). Direct Pip the seed courier, Moth the moon magician and a moonseed prop as they prepare the Moonseed Festival. This is a cartoon creator, with no platforming or drawing mechanics.

## Run

Node.js 24 recommended.

```sh
npm ci
npm run dev -- --port 5221 --strictPort
```

Production: `npm run build`, then `npm run preview -- --port 5221 --strictPort`. Bind is loopback only. Inspect that your chosen port is free first. No public website is deployed.

## Direct a cartoon

1. Choose actor slot 1 or 2, an original performer (props occupy slots too), and a canned animation.
2. Place the actor with a stage click, arrow keys, or X/Y coordinates. Choose **Set motion**.
3. Set X/Y motion (stage units per frame). Choose **Film action** at the current frame.
4. Step or scrub forward and film a different action. Filming replaces that slot's cues at and after the current frame. Rewind and cast the second actor to layer simultaneous performances.
5. Add a preset caption and optional original synthesized chime at a frame. Captions show for 24 frames; a blank caption clears it from that point.
6. Play the cartoon from the beginning (or **Here** from the current frame), pause/resume, return to edit, and revise. Save take stores the cartoon in this browser; committed edits also autosave. Reload restores it. A new cartoon or backdrop starts a fresh take after confirmation.

**Controls:** mouse or Tab/Enter for controls; stage arrow keys move draft placement 2 units (Shift: 10); in the motion step they change X/Y velocity by one unit, visualized by an arrow; otherwise Left/Right step frames. Space on stage/background plays or pauses. Escape cancels placement/playback and returns to edit. Cmd/Ctrl+S saves. Native input controls keep their ordinary keyboard behavior. No gamepad support.

The camera follows the mean location of present actors, clamped to a 1,400-unit-wide world around an 800-unit viewport. Motion is bounded to world placement limits. Repeated jump/walk/wave/spin performances are evaluated deterministically at 12 fps.

## Evidence and scope

Read [research and sources](docs/sources.md), [bounded specification](docs/spec.md), and [verification](docs/verification.md). Manual pp. 8–23 establish the actor → animation → placement → motion → film process, two slots, frame editing and destructive forward overwrite. Original controls are adapted for mouse and keyboard.

This slice has three backgrounds, three actor/prop choices, five looping animations, two tracks and 2–20 second cartoons. It approximates scenic camera follow. It does not reproduce the original content catalogue, timing/memory limits, caption pauses, music selection, gamepad cursor, VCR recording or visual effect catalogue. Browser autosave, explicit durations, visible cue strips and pause are modern additions. No video export, cloud save, undo, collision simulation or multi-scene film editing. Shortening a take removes cues past its end. Delete cues removes cues at/after the playhead; an earlier action continues until replaced. Only one saved take per origin; clear browser data removes it.

All artwork, animation, character names, story and synthesized sounds are original code in this repository. No ROMs, proprietary assets, reference scans, third-party fonts or network-loaded art are included. No affiliation with the original rights holders is implied.

## Checks

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

CI runs these on Linux with headless Chromium. Browser tests use a separate strict loopback port 5222 and isolated storage. See verification for actual results and platform/audio limits.

## License and ignore sources

Full [MIT license](LICENSE). `.gitignore` includes the official GitHub [Linux](https://github.com/github/gitignore/blob/main/Global/Linux.gitignore), [Windows](https://github.com/github/gitignore/blob/main/Global/Windows.gitignore) and [macOS](https://github.com/github/gitignore/blob/main/Global/macOS.gitignore) templates, followed by project ignores. Exact fetched templates are retained in `docs/gitignore/`.
