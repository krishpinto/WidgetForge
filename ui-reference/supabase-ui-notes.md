# Supabase UI Reference Notes

## What to extract from the reference screenshots

### Layout (supabase-1.png — project overview)
- Left sidebar: narrow (~240px), dark, icon + label nav items
- Sidebar sections separated by small caps labels (CONFIGURATION, INTEGRATIONS, BILLING)
- Main content: generous left padding, clean hierarchy
- Top breadcrumb bar: project name → branch → environment badge (PRODUCTION pill)
- Cards for stats: subtle border, icon left, label small caps above, value large below
- Background: very dark gray (#0f0f0f range), NOT pure black
- Card borders: 1px, very low opacity white

### Tables (supabase-2.png — schema view)
- Table cards with header row (icon + name + kebab menu)
- Column rows: icon left, name, type badge right (muted, monospace)
- Relationship lines between tables shown as dashed
- Monospace font for column names and types

### Settings page (supabase-3.png)
- Left sidebar active state: slightly lighter background, no border
- Content cards: flat, borderless inner sections
- Pricing tier badges: small all-caps pill (NANO, MICRO, SMALL)
- Grid layout for option cards
- Muted secondary text for descriptions

## Key visual traits to replicate
- Font: Geist Sans for UI, Geist Mono for code/IDs/types
- Sidebar width: ~240px, collapsible icons on far left
- Almost no drop shadows — depth through border + background difference only
- Active nav item: bg slightly lighter, no left border accent
- Badges/pills: rounded-full, small, muted background, matching text color
- Table rows: very subtle hover state
- Empty states: centered, icon above, muted text, one CTA button
- Spacing: generous — content never feels cramped
- Destructive actions (delete): hidden until hover or inside dropdown menu