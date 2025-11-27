import { createTheme } from '@mui/material/styles';

// Modern Dashboard Theme - Mobil tema renkleriyle hizalı
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff615e', // Mobil primary
      light: '#ff8582', // Mobil primaryLight
      dark: '#ff3d3a', // Mobil primaryDark
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#34495E', // Mobil secondary
      light: '#5D6D7E',
    },
    background: {
      default: '#f0f0f3', // Mobil background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
      disabled: '#ADB5BD',
    },
    warning: {
      main: '#FFC107', // Sarı (#FFC107)
      light: '#FFF3CD', // Açık sarı (#FFF3CD)
    },
    error: {
      main: '#DC3545',
    },
    success: {
      main: '#ff615e', // Mobil success da aynı tonda tutuluyor
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#212529',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#212529',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#212529',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#212529',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#212529',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#212529',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#212529',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#6C757D',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#6C757D',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
    '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
    '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
    '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
    '0px 25px 50px rgba(0, 0, 0, 0.35), 0px 20px 15px rgba(0, 0, 0, 0.22)',
    '0px 30px 60px rgba(0, 0, 0, 0.40), 0px 25px 20px rgba(0, 0, 0, 0.22)',
    '0px 35px 70px rgba(0, 0, 0, 0.45), 0px 30px 25px rgba(0, 0, 0, 0.22)',
    '0px 40px 80px rgba(0, 0, 0, 0.50), 0px 35px 30px rgba(0, 0, 0, 0.22)',
    '0px 45px 90px rgba(0, 0, 0, 0.55), 0px 40px 35px rgba(0, 0, 0, 0.22)',
    '0px 50px 100px rgba(0, 0, 0, 0.60), 0px 45px 40px rgba(0, 0, 0, 0.22)',
    '0px 55px 110px rgba(0, 0, 0, 0.65), 0px 50px 45px rgba(0, 0, 0, 0.22)',
    '0px 60px 120px rgba(0, 0, 0, 0.70), 0px 55px 50px rgba(0, 0, 0, 0.22)',
    '0px 65px 130px rgba(0, 0, 0, 0.75), 0px 60px 55px rgba(0, 0, 0, 0.22)',
    '0px 70px 140px rgba(0, 0, 0, 0.80), 0px 65px 60px rgba(0, 0, 0, 0.22)',
    '0px 75px 150px rgba(0, 0, 0, 0.85), 0px 70px 65px rgba(0, 0, 0, 0.22)',
    '0px 80px 160px rgba(0, 0, 0, 0.90), 0px 75px 70px rgba(0, 0, 0, 0.22)',
    '0px 85px 170px rgba(0, 0, 0, 0.95), 0px 80px 75px rgba(0, 0, 0, 0.22)',
    '0px 90px 180px rgba(0, 0, 0, 1.00), 0px 85px 80px rgba(0, 0, 0, 0.22)',
    '0px 95px 190px rgba(0, 0, 0, 1.00), 0px 90px 85px rgba(0, 0, 0, 0.22)',
    '0px 100px 200px rgba(0, 0, 0, 1.00), 0px 95px 90px rgba(0, 0, 0, 0.22)',
    '0px 105px 210px rgba(0, 0, 0, 1.00), 0px 100px 95px rgba(0, 0, 0, 0.22)',
    '0px 110px 220px rgba(0, 0, 0, 1.00), 0px 105px 100px rgba(0, 0, 0, 0.22)',
    '0px 115px 230px rgba(0, 0, 0, 1.00), 0px 110px 105px rgba(0, 0, 0, 0.22)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          backgroundColor: '#ff615e',
          '&:hover': {
            backgroundColor: '#ff3d3a',
          },
        },
        outlined: {
          borderColor: '#E5E7EB',
          color: '#34495E',
          '&:hover': {
            borderColor: '#ff615e',
            color: '#ff615e',
            backgroundColor: '#ffefeE',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
              borderColor: '#ff615e',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff615e',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        warning: {
          backgroundColor: '#FFF3CD',
          color: '#856404',
          '& .MuiAlert-icon': {
            color: '#FFC107',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: '#ffefeE',
            color: '#ff615e',
            '&:hover': {
              backgroundColor: '#ffefeE',
            },
            '& .MuiListItemIcon-root': {
              color: '#ff615e',
            },
            '& .MuiListItemText-primary': {
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2C3E50',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
          boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
