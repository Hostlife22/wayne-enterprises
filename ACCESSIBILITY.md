# Accessibility

## Implemented

- Semantic HTML buttons, navigation, headings and labeled controls around the canvas.
- Finish and configuration selection exposed with `aria-pressed`.
- Keyboard activation, visible focus indicators and a skip link.
- Specifications and assembly state readable independently of WebGL.
- Native modal dialogs contain keyboard focus; Escape and Close dismiss them, returning focus to the trigger.
- Visible Reset view and Stop film controls. Escape stops the tour.
- Reduced-motion preference makes assembly/reset changes immediate and replaces the film with explanatory text.
- Responsive reflow, page zoom support and 44px-or-larger primary control targets.
- Explicit initialization, rendering failure and WebGL-unavailable messaging.

## Verified

Automated Chromium checks exercise keyboard preset selection, dialog focus containment/return, Escape behavior, mobile horizontal overflow, reduced-motion film behavior and configuration use without WebGL. Desktop and mobile screenshots were manually inspected.

## Known limitations

The 3D canvas has no screen-reader representation of individual parts. Camera orbit and pan require pointer or touch gestures; the reset control is keyboard accessible. Technical microcopy deliberately follows the small reference typography and may require zoom. Some decorative annotations are low contrast. No full contrast audit, assistive-technology review, physical-device gesture test or WCAG conformance audit has been completed. No full accessibility compliance is claimed.

Report accessibility issues through repository issues with browser, device, assistive technology (if relevant), steps and expected behavior. Avoid including personal information.
