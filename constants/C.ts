/**
 * BoltVPN v14 — Dual-Theme Color System
 * Dark: Home + Speed Test + Feature screens
 * Light: Auth, Servers, Settings, Account screens
 */
export const C = {
  // ── DARK screens (Home, Speed Test, Feature screens) ─────────────────────
  dark:       '#0A1628',
  dark2:      '#0F1E35',
  dark3:      '#162035',
  cardDark:   'rgba(255,255,255,0.07)',
  borderDark: 'rgba(255,255,255,0.08)',
  txtDark:    'rgba(255,255,255,0.92)',
  txtDark2:   'rgba(255,255,255,0.50)',
  txtDark3:   'rgba(255,255,255,0.28)',

  // ── LIGHT screens (Auth, Servers, Settings, Account) ─────────────────────
  light:        '#F7F8FA',
  light2:       '#FFFFFF',
  grey:         '#E8EAF0',
  grey2:        '#C4C9D4',
  borderLight:  'rgba(0,0,0,0.08)',
  borderLight2: 'rgba(0,0,0,0.12)',
  txtLight:     '#1A2340',
  txtLight2:    '#7A849A',
  txtLight3:    '#B0B8C8',

  // ── Brand accent (used on both themes) ────────────────────────────────────
  teal:       '#00C896',
  teal2:      '#00A87A',
  teal3:      '#00E5B0',
  tealBg:     'rgba(0,200,150,0.12)',
  tealBg2:    'rgba(0,200,150,0.06)',
  tealBorder: 'rgba(0,200,150,0.25)',

  // ── Status colors ──────────────────────────────────────────────────────────
  red:      '#EF4444',
  redBg:    'rgba(239,68,68,0.12)',
  amber:    '#F59E0B',
  amberBg:  'rgba(245,158,11,0.10)',
  violet:   '#7C3AED',
  violetBg: 'rgba(124,58,237,0.10)',
  pink:     '#F472B6',
  purple:   '#A78BFA',

  // ── Legacy aliases (keep for backward compatibility) ──────────────────────
  bg:      '#0A1628',
  bg2:     '#0F1E35',
  card:    'rgba(255,255,255,0.07)',
  card2:   'rgba(255,255,255,0.10)',
  cyan:    '#00C896',
  emerald: '#00C896',
  txt:     'rgba(255,255,255,0.92)',
  txt2:    'rgba(255,255,255,0.50)',
  txt3:    'rgba(255,255,255,0.28)',
  border:  'rgba(255,255,255,0.08)',
  border2: 'rgba(255,255,255,0.14)',

  tint: {
    security:   'rgba(239,68,68,0.10)',
    privacy:    'rgba(124,58,237,0.10)',
    speed:      'rgba(0,200,150,0.10)',
    connection: 'rgba(0,200,150,0.10)',
    rewards:    'rgba(245,158,11,0.10)',
  },

  grad: {
    primary:   ['#00C896', '#00A87A'] as [string, string],
    connected: ['#00C896', '#00A87A'] as [string, string],
    danger:    ['#DC2626', '#EF4444'] as [string, string],
    gold:      ['#D97706', '#F59E0B'] as [string, string],
    pink:      ['#DB2777', '#F472B6'] as [string, string],
    speed:     ['#00C896', '#00E5B0'] as [string, string],
  },
};
