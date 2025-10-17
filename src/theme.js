import { createTheme } from '@mui/material/styles';

// Modern Dashboard Theme - Görseldeki tasarıma göre
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#28A745', // Yeşil (#28A745)
      light: '#E6F7ED', // Açık yeşil (#E6F7ED)
      dark: '#1E7E34',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6C757D',
      light: '#E9ECEF',
    },
    background: {
      default: '#F8F9FA', // Ana arka plan rengi
      paper: '#FFFFFF', // Kartlar ve sidebar
    },
    text: {
      primary: '#212529', // Ana metin rengi
      secondary: '#6C757D', // İkincil metin rengi
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
      main: '#28A745',
    },
    divider: '#E9ECEF',
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
          backgroundColor: '#28A745',
          '&:hover': {
            backgroundColor: '#1E7E34',
          },
        },
        outlined: {
          borderColor: '#E9ECEF',
          color: '#6C757D',
          '&:hover': {
            borderColor: '#28A745',
            color: '#28A745',
            backgroundColor: '#E6F7ED',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E9ECEF',
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
              borderColor: '#E9ECEF',
            },
            '&:hover fieldset': {
              borderColor: '#28A745',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#28A745',
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
            backgroundColor: '#E6F7ED',
            color: '#28A745',
            '&:hover': {
              backgroundColor: '#E6F7ED',
            },
            '& .MuiListItemIcon-root': {
              color: '#28A745',
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
          color: '#212529',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
          borderBottom: '1px solid #E9ECEF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E9ECEF',
          boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
