import type * as React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

// When adding a new theme, also add it to the index.html file
const THEMES = ['system', 'light', 'dark'] as const
type ThemeKey = (typeof THEMES)[number]

export interface Theme {
  key: ThemeKey
  icon: React.ComponentType<React.ComponentProps<'svg'>>
  label: string
}

export interface Config {
  themes: Array<Theme>
  themeDefault: ThemeKey
  themeStorageKey: string
}

export const config = {
  themes: THEMES.map((theme) => ({
    key: theme,
    icon: { system: Monitor, light: Sun, dark: Moon }[theme],
    label: theme,
  })),
  themeDefault: 'system',
  // when changing, also change in index.html
  themeStorageKey: 'app-theme',
} as const satisfies Config
