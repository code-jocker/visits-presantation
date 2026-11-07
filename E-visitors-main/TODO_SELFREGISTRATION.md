# TODO - Self Registration UI + Runtime Fix

- [ ] Implement `/self-registration` to reuse ScanningPage layout/behavior (recent taps + verification grid), but replace the sidebar/visual with the homepage-style moving graphic.
- [ ] Refactor `SelfRegistrationCard.tsx` into a kiosk step flow: welcome → method → visitor type → data entry → photo → host → confirmation/print → auto-reset.
- [ ] Reuse existing API calls (`visitorApi.publicCheckIn`, `usersApi.getAll`, `validatePhoneWithNumverify`) and `FaceCapture`.
- [ ] Ensure photo capture still uploads to Cloudinary and sets `profilePhoto`.
- [ ] Ensure host selection still fills `hostName`.
- [ ] Prevent submitting (`publicCheckIn`) until required step data is ready.
- [ ] Add inactivity timer (reset to Welcome) and manual reset.
- [ ] Badge printing: add UI preview + stub print action (no backend integration unless already exists).
- [ ] Verify pages render without crashes (track runtime errors).
- [ ] Run `npm run dev` and test the kiosk flow end-to-end.

