import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Chip,
  ThemeProvider,
  createTheme,
  Badge,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Image as ImageIcon,
  Business as BusinessIcon,
  AccountCircle,
  Logout,
  Edit as EditIcon,
  Storefront as StorefrontIcon,
  PhotoLibrary as PhotoLibraryIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import theme from '../theme';

const drawerWidth = 280;

const menuItems = [
  { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin', userTypes: ['admin'], section: 'Yönetim' },
  { text: 'Marka Profili', icon: <StorefrontIcon />, path: '/brand-profile', userTypes: ['brand', 'eventBrand'], section: 'Marka' },
  { text: 'Bannerlar', icon: <PhotoLibraryIcon />, path: '/banners', userTypes: ['brand', 'eventBrand'], section: 'Marka' },
  { text: 'İstatistikler', icon: <AssessmentIcon />, path: '/analytics', userTypes: ['brand', 'eventBrand'], section: 'Marka' },
];

function Layout({ children, currentUser, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Kullanıcı tipine göre menü öğelerini filtrele
  const userType = currentUser?.isAdmin ? 'admin' : (currentUser?.userType || 'customer');
  const filteredMenuItems = menuItems.filter(item => item.userTypes.includes(userType));
  const sections = Array.from(new Set(filteredMenuItems.map(i => i.section))).filter(Boolean);

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
    }}>
      {/* Logo/Brand Name Section */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        background: 'linear-gradient(135deg, rgba(255, 97, 94, 0.05) 0%, rgba(255, 97, 94, 0.02) 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ff615e 0%, #ff3d3a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 12px rgba(255, 97, 94, 0.3)',
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
              F
            </Typography>
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                fontSize: '1.1rem',
                lineHeight: 1.2,
              }}
            >
              {currentUser?.name || 'FAYDANA'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                display: 'block',
                mt: 0.25,
              }}
            >
              {currentUser?.isAdmin ? 'Admin Panel' : 'Marka Yönetimi'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2, overflow: 'auto' }}>
        {sections.map((section) => (
          <Box key={section} sx={{ mb: 2 }}>
            <List
              subheader={
                <ListSubheader 
                  component="div" 
                  sx={{ 
                    bgcolor: 'transparent', 
                    color: 'text.secondary', 
                    fontWeight: 600, 
                    px: 3, 
                    py: 1,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {section}
                </ListSubheader>
              }
              sx={{ px: 1.5 }}
            >
              {filteredMenuItems.filter(i => i.section === section).map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: 2,
                      mx: 0.5,
                      transition: 'all 0.2s ease-in-out',
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, rgba(255, 97, 94, 0.1) 0%, rgba(255, 97, 94, 0.05) 100%)',
                        color: 'primary.main',
                        borderLeft: '3px solid',
                        borderColor: 'primary.main',
                        '&:hover': { 
                          background: 'linear-gradient(135deg, rgba(255, 97, 94, 0.15) 0%, rgba(255, 97, 94, 0.08) 100%)',
                        },
                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                        '& .MuiListItemText-primary': { fontWeight: 600 },
                      },
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 'inherit',
                        letterSpacing: '0.2px',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {section !== sections[sections.length - 1] && (
              <Divider sx={{ my: 1.5, mx: 2, borderColor: 'divider' }} />
            )}
          </Box>
        ))}
      </Box>
      
      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        background: alpha(theme.palette.background.default, 0.5),
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
          © 2024 Faydana
        </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', backgroundColor: 'background.default', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: 'text.primary',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: '64px !important' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' }, 
                color: 'text.secondary',
                '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Search Bar - Placeholder for future */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />
            
            {/* User Info Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                sx={{
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton
                sx={{
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <SettingsIcon />
              </IconButton>
              
              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  gap: 1.5,
                  '&:hover': { 
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {currentUser?.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      display: 'block',
                    }}
                  >
                    {currentUser?.userType === 'eventBrand' ? 'Etkinlik Markası' : 'Marka'}
                  </Typography>
                </Box>
              </Box>
              
              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{
                  mt: 1.5,
                  '& .MuiPaper-root': {
                    borderRadius: 2,
                    minWidth: 240,
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                  }
                }}
              >
                <Box sx={{ 
                  px: 2.5, 
                  py: 2, 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  background: 'linear-gradient(135deg, rgba(255, 97, 94, 0.05) 0%, rgba(255, 97, 94, 0.02) 100%)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {currentUser?.userType === 'eventBrand' ? 'Etkinlik Markası' : 'Marka'}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
                        {currentUser?.name}
                      </Typography>
                    </Box>
                  </Box>
                  {currentUser?.email && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      {currentUser.email}
                    </Typography>
                  )}
                </Box>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate('/brand-profile');
                  }}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  <ListItemIcon>
                    <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Profili Düzenle
                    </Typography>
                  </ListItemText>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    color: '#DC3545',
                    '&:hover': {
                      backgroundColor: alpha('#DC3545', 0.08),
                    }
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: '#DC3545' }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#DC3545' }}>
                      Çıkış Yap
                    </Typography>
                  </ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
                borderRight: '1px solid',
                borderColor: 'divider',
                boxShadow: '4px 0px 16px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
                borderRight: '1px solid',
                borderColor: 'divider',
                boxShadow: '4px 0px 16px rgba(0, 0, 0, 0.08)',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: 'background.default',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          <Toolbar />
          <Box
            sx={{
              width: '100%',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Layout; 