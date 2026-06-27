# TODO - Self Registration kiosk workflow + robot sidebar

## Steps
- [ ] Refactor `src/components/SelfRegistrationCard.tsx` into a real step flow:
  - [ ] welcome (logo + greeting + “Tap to Start”)
  - [ ] method selection grid
  - [ ] visitor type selection (Guests / Contractors / Interviews)
  - [ ] data entry + phone auto-validation
  - [ ] photo capture + face verification
  - [ ] host selection + (host notification UI stub)
  - [ ] confirmation summary
  - [ ] printing UI + badge preview (print action stub)
  - [ ] prevent submit until required data is complete
- [ ] Add inactivity timer (auto reset to welcome after inactivity)
- [ ] Add left sidebar with animated “robot moving icons” (CSS animation)
- [ ] Ensure existing API calls still work:
  - [ ] `visitorApi.publicCheckIn`
  - [ ] `usersApi.getAll` (hosts)
  - [ ] `validatePhoneWithNumverify`
  - [ ] `FaceCapture` + `uploadToCloudinary` + `visitorApi.faceVerify`
- [ ] Run `npm run dev` and manual test the full kiosk flow

