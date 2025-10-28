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
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Chip,
  ThemeProvider,
  createTheme,
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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import theme from '../theme';

const drawerWidth = 280;

const menuItems = [
  { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin', userTypes: ['admin'] },
  { text: 'Marka Profili', icon: <StorefrontIcon />, path: '/brand-profile', userTypes: ['brand', 'eventBrand'] },
  { text: 'Bannerlar', icon: <PhotoLibraryIcon />, path: '/banners', userTypes: ['brand', 'eventBrand'] },
  { text: 'İstatistikler', icon: <AssessmentIcon />, path: '/analytics', userTypes: ['brand', 'eventBrand'] },
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
  const filteredMenuItems = menuItems.filter(item => 
    item.userTypes.includes(userType)
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand Name Section */}
      <Box sx={{ p: 3, borderBottom: '1px solid #E9ECEF' }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{ 
            fontWeight: 700,
            color: '#28A745',
            fontSize: '1.25rem'
          }}
        >
          {currentUser?.name || 'FAYDANA'}
        </Typography>
      </Box>
      
      {/* Navigation Menu */}
      <Box sx={{ flex: 1, p: 1 }}>
        <List sx={{ px: 1 }}>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
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
                  '&:hover': {
                    backgroundColor: '#F8F9FA',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: '#FFFFFF',
            color: '#212529',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
            borderBottom: '1px solid #E9ECEF',
          }}
        >
          <Toolbar sx={{ px: 3 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' }, color: '#6C757D' }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* User Info Section */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: '#F8F9FA',
                  },
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mr: 2, 
                    color: '#212529',
                    fontSize: '0.95rem',
                    fontWeight: 600
                  }}
                >
                  {currentUser?.name}
                </Typography>
                
                <Chip
                  label="T"
                  size="small"
                  sx={{
                    backgroundColor: '#28A745',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    width: 24,
                    height: 24,
                  }}
                />
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
                  mt: 1,
                  '& .MuiPaper-root': {
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E9ECEF',
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E9ECEF' }}>
                  <Typography variant="body2" sx={{ color: '#6C757D', fontSize: '0.75rem' }}>
                    {currentUser?.userType === 'eventBrand' ? 'Etkinlik Markası' : 'Marka'}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212529' }}>
                    {currentUser?.name}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate('/brand-profile');
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#F8F9FA',
                    }
                  }}
                >
                  <ListItemIcon>
                    <EditIcon fontSize="small" sx={{ color: '#28A745' }} />
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
                    px: 2,
                    color: '#DC3545',
                    '&:hover': {
                      backgroundColor: 'rgba(220, 53, 69, 0.08)',
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
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid #E9ECEF',
                boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.1)',
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
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid #E9ECEF',
                boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.1)',
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
            p: { xs: 2, sm: 4 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: '#F8F9FA',
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Layout; 