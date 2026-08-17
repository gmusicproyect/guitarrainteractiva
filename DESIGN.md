# GMusic Design System

## Product principle

GMusic presents one meaningful learning action at a time. The interface may show where the student is going, but it must not expose every lesson, metric, and tool simultaneously.

## Learning hierarchy

`Course > Module > Folder > Skill > Practice > Assessment > Unlock`

- A folder is one pedagogical responsibility.
- Folders 01-04 certify individual skills.
- Folder 05 is an integrative capstone, not a fifth independent skill.
- Folders 00 and 06 orient and close the module; they do not certify skills.
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
