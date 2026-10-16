# Verification

Completed on connected Mac, 2026-10-16. No existing project, save, preview process, or security setting was modified. New origin/storage key only; prior occupied ports through 5220 were left alone.

## Automated acceptance

- Strict TypeScript (`npm run typecheck`) passed.
- Four Vitest behavioral tests passed: independent actor layering and forward replacement, camera mean-follow/boundaries, save round-trip and invalid data rejection, cue deletion/caption ordering/replacement/length trimming.
- Three Playwright Chromium scenarios passed: blank authoring → two actions → second actor → caption → full playback/pause/resume/end → edit/save/reload → actual earlier overwrite preserving other actor → scene cancellation/replacement; stage keyboard placement/motion/clamping/frame stepping/Space/Escape; destructive-reset modal focus containment/restoration.
- Production build passed. No runtime dependencies or remote artwork/font requests.
- Test server uses isolated browser contexts and strict port 5222; the lasting production preview uses strict port 5221 on loopback.

## Mac normal-input acceptance

In connected Mac Chrome, used only normal visible controls to:

1. Choose Midnight rooftops and confirm a fresh cartoon; change length to 5 seconds.
2. Cast Pip, choose walk, place with mouse and arrow-key adjustment, set motion X=2 with stage arrows, then Film.
3. Advance the slider 24 frames using keyboard, choose jump and film the next performance.
4. Rewind, choose actor 2, cast Moth, enter X=570, choose wave and film.
5. Add “Meet me under the moon!”, save, play from frame 0 and observe frame 59/59 / “THAT’S A WRAP”. Camera moved from 44 to 68.
6. Return to edit, advance to frame 24, film Moth spinning, save and reload. Verified restored rooftop, duration, caption and both tracks' frame-0/frame-24 cues.
7. Play the revised cartoon through its end, return to edit, rewind and save. Left the deliverable tab open.

[Mac screenshot](workshop-mac.jpg) captures the verified restored take. The screenshot contains only this original app.

## Independent review

See [review findings and fixes](reviews.md). Both independent code and fidelity reviewers rechecked their corrections and found no residual material issue within scope.

## Coverage limits

Mac Chrome was exercised directly; headless Chromium was exercised locally and is configured in Linux CI. Windows, Safari, Firefox, physical mobile devices and gamepads were not tested. Responsive CSS is implemented, but no mobile acceptance claim is made. Audible output was not verified; original Web Audio chime synthesis exists and remains opt-in. No claim of tested music, recording/export or original caption pause behavior.

## Production preview

Detached Node/Vite production preview, `http://127.0.0.1:5221/`, PID recorded in the local task report. Started in a separate process session with output in `/tmp/pocket-picture-preview.log`, outside Git. Preview survives command/turn completion while the host is awake and process is running. No public website deployment.
