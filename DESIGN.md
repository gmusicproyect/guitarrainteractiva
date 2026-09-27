# GMusic Design System

## Product principle

GMusic presents one meaningful learning action at a time. The interface may show where the student is going, but it must not expose every lesson, metric, and tool simultaneously.

## Learning hierarchy

`Course > Module > Folder > Skill > Practice > Assessment > Unlock`

- Guitarra 1 presents five modules as one course-level flow.
- A folder is one pedagogical responsibility.
- Module 1 is limited to understanding and handling the instrument before chords.
- Folders 01-05 certify anatomy, tuning pegs, strings, nut and frets, and first plucks.
- Folders 00 and 06 orient and certify the module; they do not add independent skills.
- Mistakes trigger teaching support, never punishment.

## Visual states

- Completed: green, checkmark, available for review.
- Current: coral, emphasized action, clear next step.
- Locked: neutral, low contrast, explicit prerequisite.
- Capstone: gold accent, used only for the final musical challenge.

Color is always paired with text and an icon or shape.

## Components

- The connected folder flow is the primary representation of every module.
- Learning path nodes use a connected vertical rail and expose their purpose even when locked.
- Only the current node has a primary action.
- Every folder defines five internal sections in order: teaching, practice, support, assessment, and unlock.
- Every internal section declares both its pedagogical purpose and its learner-facing content.
- Folder details render those sections as a second connected flow.
- Buttons have a minimum touch target of 44px and visible focus states.
- Cards are not nested inside other cards.

## Content rules

- Headings name the action or skill, not the implementation.
- Technical IDs and filenames stay in data manifests and developer documentation.
- Learner-facing notes use Spanish names plus international notation, for example `Mi · E`.
- Completion language reports what the student demonstrated without overstating mastery.

## Responsive behavior

- Desktop shows the folder path with concise descriptions.
- Mobile keeps the rail, stacks metadata, and preserves one clear action.
- No horizontal scrolling is allowed in the learning path or folder modal.

## Studio interface (2026)

- Warm off-white workspace, white surfaces, muted green for progress, terracotta for the next action.
- Desktop sidebar separates study, learning path, harmony, free exploration and personal progress. Mobile uses five labeled bottom-navigation controls.
- The home page pairs one current lesson with a real, playable six-string instrument. There are no simulated students, completion percentages, achievements or testimonials.
- Primary controls have a subtle pressed state. All navigation and interactive controls expose visible keyboard focus.
- Progress is calculated from completed lessons, stored locally and explained plainly. Future course modules are explicitly marked as forthcoming.
- The illustration is an original inline vector, not an external download; typography falls back to system fonts.
- Shared color tokens apply to lessons and dialogs. The free fretboard keeps a dark, high-contrast playing surface. Motion is suppressed when reduced motion is requested.
- The legacy demo pages retain their original styles; `studio.css` is loaded only by the current application.

## Harmony laboratory

- Original short progressions connect listening, chord spelling, Roman numerals and the guitar note map.
- Tonality and tempo are explicit choices. Sound starts on interaction and stops on navigation, hiding the page, muting or changing the study.
- The fretboard is a map of chord tones, not a fingering diagram. Its legend and instructions make this distinction explicit.
- The laboratory is free exploration with immediate educational feedback; it does not award XP or bypass the course prerequisites.
- Open reading links name their source and language; technical library details belong in documentation.
