---
target: src/routes/events.tsx (app-wide surface)
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-05-29T13-25-46Z
slug: src-routes-events-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No loading state on initial feed render; no confirmation after save; no progress indicator for multi-step forms |
| 2 | Match System / Real World | 3 | Bottom nav icons lack labels (Calendar, Ticket, Lightbulb — not self-explanatory); otherwise natural terminology |
| 3 | User Control and Freedom | 3 | Back buttons, cancel on modals, logout present. No undo for joins, but confirmation dialogs for destructive actions |
| 4 | Consistency and Standards | 3 | Forms share same component vocabulary; bottom nav consistent; event feed uses card pattern different from profile lists |
| 5 | Error Prevention | 3 | Email domain validation, date/time pickers, disabled-submit-while-incomplete, delete confirmation. No autosave or draft recovery |
| 6 | Recognition Rather Than Recall | 2 | Icon-only bottom nav forces memorization; no way to see saved events without navigating; tips grid relies on images alone for recognition |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts, no bulk actions, no recent-items tracking, no quick-jump navigation |
| 8 | Aesthetic and Minimalist Design | 3 | Clean off-white canvas, strong ember accent, good image-forward event cards. Profile page is a repetitive wall of identical row items |
| 9 | Error Recovery | 2 | Login/signup errors are clear and preserve input. No "forgot password" flow; no inline field validation until submit; network errors unhandled |
| 10 | Help and Documentation | 1 | No onboarding, no tooltips, no FAQ, no help page. The app expects users to figure everything out by exploration |
| **Total** | | **23/40** | **Acceptable — significant improvements needed** |

#### Anti-Patterns Verdict

**AI slop check**: The app mostly clears the bar. The Fraunces + Manrope pairing and ember accent feel intentional. The event cards with image overlays are well-executed and don't look templated. However, the profile page's row-after-row of identical white cards with icon + label + chevron does trigger the "identical card grid" ban. The bottom nav with icon-only tabs (Calendar, Ticket, Lightbulb, Chat, Profile) requires users to memorize what each icon means — a common AI-generated shortcut.

**Deterministic scan**: Bundled detector unavailable. Manual review complete.

#### Overall Impression

A competent, visually cohesive event app that does the basics well. The image-forward event feed is the strongest surface. The weakest surfaces are the profile page (homogeneous row items competing for attention) and the complete absence of help/onboarding for first-time users. The icon-only bottom navigation is the single biggest usability gap — it asks every new user to learn an arbitrary mapping.

#### What's Working

1. **Event cards** — The full-bleed image cards with gradient overlays, tag chips, and hover zoom are genuinely well-crafted. Good hierarchy: image → title → metadata → price/CTA. The backdrop-blur tag chips and the animated arrow on hover show attention to detail.

2. **Form design** — Consistent input styling (rounded-2xl, subtle borders, clean labels), proper disabled states on submit buttons, and the progressive disclosure in tip creation (category → conditional fields) reduce cognitive load.

3. **Dark mode** — The dark theme isn't an afterthought. Colors are tuned per-mode (ember becomes lighter, backgrounds shift to a dark teal/charcoal rather than pure black), and all components respect it consistently.

#### Priority Issues

**[P1] Icon-only bottom navigation** — All five tabs are unlabeled icons. A new user arriving on the events page has no way to know what "ticket icon" (Tickets), "lightbulb" (Tips), or "chat bubble" (Feed) mean without trial-and-error tapping.

- **Why**: Cognitive load — forces memorization. Violates Recognition Rather Than Recall.
- **Fix**: Add text labels beneath each icon, or tooltip on hover/ long-press.
- **Suggested command**: `craft` Add labels to bottom nav

**[P1] No onboarding or first-run guidance** — A newly signed-up user sees an empty events feed with no explanation of what to do next. No empty-state CTA beyond "No events yet."

- **Why**: High abandonment risk for first-timers who don't know where to start.
- **Fix**: Add a contextual empty state with a primary CTA ("Create your first event" for admins, "Browse events" for users). Or a one-time onboarding overlay.
- **Suggested command**: `onboard` /feed and /events

**[P1] Save/join feedback gap** — The save button toggles visually but gives no confirmation feedback (no toast, no animation, no sound). The join button shows a spinner but after success just navigates away with no "You joined!" confirmation.

- **Why**: Users are left uncertain whether the action completed.
- **Fix**: Add a brief toast or checkmark animation after save/join.
- **Suggested command**: `harden` Add feedback toasts for save/join actions

**[P2] Profile page is a wall of similar rows** — "Modify my Information", "My Tips", "My Events", "My Groups", "Notifications", "Settings" all use the identical card pattern (icon + label + chevron). Hard to scan at a glance.

- **Why**: Violates Aesthetic and Minimalist Design — everything competes equally.
- **Fix**: Group related items with section headers, or use different visual weights for primary vs secondary actions.
- **Suggested command**: `layout` Redesign profile page rows

**[P2] CreateFAB "Post" option visible to non-logged-in users** — The FAB is hidden for unauthenticated users entirely (returns null), but the "Post" option check happens after the null guard. The current code checks `if (!stored) return null` which correctly hides the FAB, so this is more a code clarity issue than a real bug. Noting for completeness.

- **Why**: Not user-visible, but code smells.
- **Fix**: N/A — already handled correctly.

#### Persona Red Flags

**Alex (Power User)** — No keyboard shortcuts anywhere. Creating an event requires navigating a multi-field form with no tab-order optimization. Cannot bulk-hide/show events. Cannot jump to a specific event by typing. Will find the icon-only nav frustratingly slow. Abandonment risk: medium.

**Jordan (First-Timer)** — Lands on an empty events feed. No tooltips, no onboarding, no help button in the header. Must figure out that the bottom nav icons map to Events/Tickets/Tips/Feed/Profile through trial and error. The FAB with "+" is the only creation affordance — no text prompt. Will likely tap around aimlessly. Abandonment risk: high.

**Pat (Event Organizer / Admin)** — The "My Events" management page is functional but bare: a plain list of event titles with dates. No way to see join rates at a glance, no filtering by hidden/visible, no sorting. The attendee panel is buried inside each event's edit page. Will need to click through every event to check attendance. Frustration risk: medium.

#### Minor Observations

- The "EAT." header logo doesn't link to home on the events page since it's redundant with the bottom nav Events tab — intentional, but could be clickable for consistency.
- Dark mode toggle is absent from the UI (only respects `.dark` class on `<html>`). Users can't switch modes themselves.
- Tips "My Tips" shows user-created tips only, but the create page doesn't pre-select a category — every new tip starts with no category selected, requiring an extra tap.
- The EventsFeed search input is clearable with an X button, but the Tips and Feed pages lack equivalent search.

#### Questions to Consider

- "What if the bottom nav had labels AND icons — would the app feel less mysterious?"
- "Does every profile action (Notifications, Settings) need to be a full row card, or could some live in a settings sub-page?"
- "What would it look like if the first-run experience guided users to their first meaningful action instead of dropping them on an empty feed?"
