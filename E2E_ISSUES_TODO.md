# E2E Game Issues and Suggestions

## Branch
- `issue/e2e-main-test`

## Summary
Attempted to run a full two-player game on `main` using the camofox browser pages.

## Observed issues

1. Socket backend is not reachable from the remote browser host.
   - `fetch('http://127.0.0.1:3001/health')` timed out.
   - `fetch('http://192.168.41.67:3001/health')` also timed out.
   - The app uses `window.location.hostname:3001` by default, which fails when the browser is on a different host.
   - Result: the browser stays on `Connecting...` or reports `Socket connect failed: timeout`.

2. Room join is unreliable on `main`.
   - On first load, the lobby often shows `Waiting (0/2)`.
   - After refresh, one player may see `Waiting (1/2)` while the other sees `Start Game (2)`.
   - This indicates the `join_room` emit is sent before the socket connection is established.
   - Result: room membership and lobby state require a manual refresh.

3. Start Game does not transition reliably.
   - The `Start Game (2)` button can appear, but clicking it does not always start the game.
   - This is likely tied to unstable socket connectivity or missing server-side join metadata.

4. The remote browser environment exposes only port 3000 to the app, not the backend port 3001.
   - This means end-to-end play cannot be completed unless the backend is exposed through the same forwarded host or configured via `NEXT_PUBLIC_SERVER_URL`.

## Suggestions

- Make the backend socket URL configurable via `NEXT_PUBLIC_SERVER_URL`.
  - Default to the current host only when the browser host is also the backend host.
  - Allow overriding for remote browser environments.

- Queue the `join_room` event until after the Socket.IO client is connected.
  - Prevent dropped join requests when the page renders before the socket is ready.

- Provide a backend proxy or same-origin socket endpoint through Next.js.
  - This would allow the frontend to connect via the existing app host instead of requiring an additional port.

- Improve lobby connection UI feedback.
  - Show explicit socket status and retry join when connection is restored.
  - If join fails, offer a reload/retry button instead of leaving the user stuck.

- Add a dedicated E2E test plan for remote browser environments.
  - Validate that the socket host selection works for both local and remote clients.
  - Confirm that the lobby updates for all players without a reload.

## Notes

- The backend health endpoint is reachable from the local host, but not from the remote browser pages.
- The current `main` branch is therefore not fully playable in the camofox browser environment without a network/configuration fix.
