import { createTheme } from '@mui/material/styles';

export function getDesignTokens(mode) {
  const isDark = mode === 'dark';

  return {
    palette: {
      mode,
      primary: {
        main: isDark ? '#8b7cf6' : '#6d5bd0',
        light: isDark ? '#ab9ffb' : '#9083e0',
        dark: isDark ? '#6857d6' : '#4c3ba0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#4fd1c5' : '#2a9d8f',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#12131a' : '#f6f5fb',
        paper: isDark ? '#1a1b25' : '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };
}

export function createAppTheme(mode) {
  return createTheme(getDesignTokens(mode));
}
