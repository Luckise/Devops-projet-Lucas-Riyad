---
target: whole app
total_score: 22
p0_count: 0
p1_count: 2
p2_count: 3
timestamp: 2026-05-29T11-58-01Z
slug: file-home-lucas-devops-devops-projet-lucas-riyad
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading states exist on forms/join but no skeleton states on event feed |
| 2 | Match System / Real World | 3 | Event metaphors (calendar, ticket, map pin) are clear. "EAT." brand name is abstract. |
| 3 | User Control and Freedom | 2 | No cancel/back on event creation form. No undo for hidden events. |
| 4 | Consistency and Standards | 3 | Form patterns are consistent. Edit page has different background (#fdfdfc) than the list (zinc-50). |
| 5 | Error Prevention | 2 | Form validation is minimal (empty checks only). No confirmation on destructive actions. |
| 6 | Recognition Rather Than Recall | 2 | Icon-only bottom nav requires learning. No labels on any nav items. |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts, no search/filter on events, no bulk operations. |
| 8 | Aesthetic and Minimalist Design | 4 | Clean layout, excellent typography pairing (Fraunces + Manrope), distinctive off-white base. |
| 9 | Error Recovery | 1 | No undo for soft-deleted events. No confirmation dialogs. SSR crash is silently swallowed. |
| 10 | Help and Documentation | 1 | No onboarding, no tooltips, no help text beyond form labels. |
| **Total** | | **22/40** | **Needs improvement** |

## Anti-Patterns Verdict

**AI slop assessment**: The app avoids the worst generic patterns. The Fraunces/Manrope typography pairing, the full-bleed image-first event cards, and the off-white background give it a curated editorial feel that most templates lack. However, the icon-only bottom nav and the standard list layouts on profile/tickets pages are weak points that pull it back toward generic territory. The app feels like it has a strong design direction that isn't consistently applied across all surfaces.

**Deterministic scan**: Unavailable — detector script failed with "bundled detector not found." Manual review only.

## Overall Impression

The app has a genuinely strong visual identity at its best (events feed) and a warm, editorial feel from the Fraunces/Manrope pairing. But the consistency drops sharply on secondary pages (profile, tickets, admin manage). The biggest gap is between the ambitious visual language on public surfaces and the functional-but-generic admin/utility pages.

## What's Working

1. **Events feed imagery**: Full-bleed cards with gradient overlays and hover zoom create a genuinely immersive browsing experience that matches the Fever inspiration. The blur-back badge treatment and text-over-image readability are well-executed.

2. **Typography pairing**: Fraunces for display (titles, headings, the "EAT." brandmark) with Manrope for UI/body is a distinctive choice that immediately sets this apart from generic sans-only app templates. The serif display creates editorial weight.

3. **Color system**: The OKLCH-based token system with warm amber (`--ember`) accent on off-white base (`#fdfdfc`) is technically sound and visually warm. Dark mode properly inverts with tinted neutrals rather than pure black.

4. **Auth progressive disclosure**: The step-by-step email → password flow on both login and signup reduces cognitive load. The EFREI badge and domain hint communicate scope immediately.

## Priority Issues

- **[P1] Icon-only bottom navigation**: Five icons with zero text labels. Users must memorize or guess what each icon means. Calendar = events? MessageSquareText = feed? Ticket = tickets? This violates Nielsen's Recognition heuristic. The profile avatar is slightly more recognizable but still ambiguous.

- **[P1] No confirmation on destructive actions**: "Delete Event" hides the event immediately with no "Are you sure?" step. No undo mechanism. One accidental click permanently hides an event from the public feed. This is a trust-destroying interaction.

- **[P2] SSR failure on events feed**: `EventsFeed.tsx` accesses `localStorage` at module evaluation time (line 7), which crashes server-side rendering. The app falls back to client rendering, but the error template flashes on every initial page load. This is a production-blocking defect.

- **[P2] Inconsistent background colors**: The create/edit event form uses `bg-[#fdfdfc]` while the profile pages use `bg-zinc-50`. These are visually distinct off-whites that create a disjointed feeling when navigating between admin surfaces. The app should use one background token.

- **[P2] No search or filter on events feed**: With mock data of 5 events, it's manageable. But the real app will have hundreds. Users have no way to find specific events without scrolling. The empty state for zero results is also missing.

- **[P3] No labels on form back buttons**: The back arrow on create event (`events.new.tsx`) navigates to `/` (home) with no label. Users expect back arrows to go to the previous logical page, not a hard-coded destination. If they came from the profile events list, they go home instead.

- **[P3] Skeleton/loading states absent**: The events feed shows nothing while data loads. The join flow shows a spinner in the button but the page content itself has no loading skeleton. First-time load feels abrupt.

## Persona Red Flags

**Alex (Power User / Admin)**: No keyboard shortcuts anywhere. Creating an event requires filling 10+ fields with no tab-to-submit optimization. Managing group members requires navigating to a separate page. No bulk actions for events. Will feel the friction of repetitive admin tasks immediately. High abandonment for frequent use.

**Jordan (First-Time Visitor / Student)**: Lands on the events feed with no onboarding. The icon-only nav provides no clues about what each section does. "Tips" and "Feed" are unfamiliar labels for a student used to Instagram/TikTok. The delete flow has no safety net. Will probably figure out browsing events and joining, but admin tasks will be intimidating.

## Minor Observations

- `login.tsx` and `signup.tsx` contain ~650 lines each. The seed data, hashing logic, and form UI could be extracted into hooks/helpers.
- "HelloAsso" external link opens in a new tab with no user warning. Could feel like a phishing pattern.
- The dark mode toggle appears to be absent from the UI (no visible switch). Dark mode exists in the CSS but no user-facing control.
- BottomNav has `pb-safe` for safe area but this only covers iOS notch; no similar treatment for the top header in landscape mode on Android.
- Profile edit page validates on blur? Not clear from reading; if not, users may submit invalid data without feedback.

## Questions to Consider

- "What if the bottom nav showed text labels on active items only?"
- "Does the admin UI need to feel this different from the public UI, or should they share more of the editorial design language?"
- "What would a confident search experience look like on the events feed?"
- "Should delete be reversible for a grace period?"
