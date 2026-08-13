# 1:1 Restoration of Non-Canvas Submission Page

The user wants a 1:1 restoration of the page shown in images `file-192` and `file-193`, which is the interface displayed after submitting a prompt in **Non-Canvas Mode** from the home page.

## User Requirements
- **Trigger**: When a user submits a prompt in "Non-Canvas Mode" (All-round Reference / 全能参考) from the Home page.
- **Visuals**: 1:1 restoration of `file-192` (Chat view) and `file-193` (Resource view).
- **Branding**: Ensure "Artrail" consistency (no "Flova").
- **Theme**: Dark glassmorphism to match the existing Artrail system.

## Proposed Changes

### 1. New Route: `/creative-assistant`
Create a new route `src/routes/creative-assistant.tsx` to handle this specific "Interactive Assistant" workflow.
- **Layout**: Two-column layout when resources are open.
  - **Left**: Chat interface with bubble messages and interactive cards.
  - **Right**: Resource panel (Resources / 资源) with Documents, Images, and Videos.
- **Components**:
  - `AssistantChat`: Handles the multi-turn interaction shown in `file-192`.
  - `AssistantResources`: The grid-based asset viewer from `file-193`.
  - `InteractiveChoiceCard`: The "Video Duration" selection card with "Submitted" (已提交) status.

### 2. Update Home Page Navigation
Modify `src/routes/index.tsx` to check the `canvasMode` state (via PromptBox) and navigate to `/creative-assistant` instead of `/script` when Canvas mode is OFF.

### 3. Update Branding
Fix remaining "Flova" references in `src/routes/script.tsx` and ensure the new components use "Artrail".

### 4. Component Details (1:1 Restoration)
- **Chat Bubbles**: Pill-shaped for user, text-only or card-integrated for AI.
- **Resource Drawer**: Side panel with "View Session Resources" (查看对话资源) button.
- **Input Area**: Large capsule input at the bottom with attachment (+) button and settings (16:9, Model, Skill, Resolution, 2K).

## Technical Details
- Use `framer-motion` for the side panel expansion/contraction.
- Maintain shared state for selected model/skills between Home and the Assistant page.
- Use `shadcn/ui` components (Dialog, Popover, etc.) with custom Artrail styling.
