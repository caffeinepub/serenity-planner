# Serenity Planner

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Weekly Planner view: Monday–Sunday grid, tasks per day, checkable tasks
- Daily Detail View: click a day to open, shows tasks + "Today's Focus" input
- Goals System: Daily goals section and Monthly goals sections with add/edit/complete
- Mood Tracker: emoji-based mood selection per day
- Motivation System: rotating placeholder motivational messages
- Full localStorage persistence: tasks, completed status, daily goals, monthly goals, mood, focus notes
- Smooth animations: task completion animation, soft transitions
- Pastel theme: cream, blush pink, light beige — elegant and calming
- Mobile-friendly responsive layout

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: minimal stub (no real backend functionality needed — all data lives in localStorage)
2. Frontend:
   - `useLocalStorage` custom hook for persistence
   - `WeeklyView` component: 7-day grid with task chips and quick-add
   - `DayDetailModal` component: expanded day view with tasks + focus input
   - `GoalsPanel` component: daily + monthly goals with CRUD
   - `MoodTracker` component: per-day emoji picker
   - `MotivationBanner` component: rotating quote display
   - App shell with bottom nav (Week / Goals) for mobile
   - All state initialized from and synced to localStorage
