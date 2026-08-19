# Skill Creation Dialog Visual Redesign Plan

Based on the provided reference image (user-uploads://file-346), I will redesign the `CreateSkillDialog` to 1:1 match the layout, typography, and visual style while preserving the existing functional elements.

## Design Goal
Transform the current full-screen 2-column layout into a 3-pane modal layout as shown in the reference:
1.  **Left Pane (Outline/Directory)**: Minimalist list showing "SKILL.md".
2.  **Middle Pane (Content Editor)**: Clean markdown-like editor with subtle section headers (e.g., ## 做什么).
3.  **Right Pane (Form Settings)**: Vertical form for Skill Name, Description, Category Tags, Cover, etc.

## Technical Details
- **Container**: Update `DialogPrimitive.Content` to use a white background (`bg-white`), `rounded-[1.5rem]`, and standard modal dimensions instead of full-screen if possible, or maintain the large centered layout with appropriate padding.
- **Typography**: Switch to high-contrast, clean sans-serif (Inter/system) as seen in the image.
- **Form Elements**:
    - Custom rounded input fields with light gray backgrounds (`bg-[#F9F9F9]`).
    - Pill-shaped category tags with selected states.
    - Image upload placeholders (16:9 aspect ratio) with "+" icons.
    - Character counters for inputs (e.g., 0/20).
- **Navigation**: Update the top header to show "创建技能" and a standard close button.
- **Save Action**: Relocate the save button to the bottom right of the settings pane.

## Steps
1.  Modify `src/components/skill/CreateSkillDialog.tsx` to restructure the grid layout.
2.  Update CSS classes for the three panes (Left: Sidebar, Center: Editor, Right: Config).
3.  Implement the specific form fields shown in the reference image (Name, Intro, Tags, Cover, Examples, Prompt Guide).
4.  Ensure dark/light mode consistency (defaulting to the light mode style shown in the reference).
