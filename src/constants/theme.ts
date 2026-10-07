// ============================================================================
// WashUp - Design System & Theme Tokens
// Clean, Modern, Blue & White Palette for Laundry Management
// ============================================================================

export const COLORS = {
  // Brand Primary (Blue)
  primary: '#0284C7',        // Sky 600 - Main Brand Blue
  primaryDark: '#0369A1',    // Sky 700 - Deep Blue for text & active states
  primaryLight: '#E0F2FE',   // Sky 100 - Soft Light Blue Accent
  primarySoft: '#F0F9FF',    // Sky 50 - Very Subtle Blue Tint
  accent: '#38BDF8',         // Sky 400 - Vibrant highlight

  // Neutrals & Backgrounds (White & Off-White)
  background: '#F8FAFC',     // Slate 50 - Crisp off-white app background
  surface: '#FFFFFF',        // Pure White for Cards, Modals & Sheets
  surfaceSubtle: '#F1F5F9',  // Slate 100 - Secondary containers & dividers
  border: '#E2E8F0',         // Slate 200 - Clean subtle borders
  borderLight: '#EDF2F7',    // Light divider

  // Typography
  textPrimary: '#0F172A',    // Slate 900 - High contrast headings & body
  textSecondary: '#475569',  // Slate 600 - Readable secondary labels
  textMuted: '#94A3B8',      // Slate 400 - Placeholders & subtle metadata
  textOnPrimary: '#FFFFFF',  // White text on primary buttons
  textLight: '#CBD5E1',

  // Semantic Status Colors
  statusProcess: '#0284C7',     // Blue for "Sedang Dicuci" / "Diproses"
  statusProcessBg: '#E0F2FE',
  statusProcessBorder: '#BAE6FD',

  statusSuccess: '#10B981',     // Emerald 500 for "Selesai"
  statusSuccessBg: '#ECFDF5',
  statusSuccessBorder: '#A7F3D0',

  statusDanger: '#EF4444',      // Red 500 for "Dibatalkan"
  statusDangerBg: '#FEF2F2',
  statusDangerBorder: '#FECACA',

  statusWarning: '#F59E0B',     // Amber 500 for warnings / pending
  statusWarningBg: '#FFFBEB',
  statusWarningBorder: '#FDE68A',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
  },
  bodyLarge: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: COLORS.textMuted,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: COLORS.textSecondary,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  hover: {
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
};
