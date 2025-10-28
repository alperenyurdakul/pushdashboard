import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Layout from './components/Layout';
import LoginScreen from './screens/LoginScreen';

// Pages
import Banners from './pages/Banners';
import BrandProfile from './pages/BrandProfile';
import ComingSoon from './pages/ComingSoon';
import AdminPanel from './pages/AdminPanel';
import Analytics from './pages/Analytics';

// Import our custom theme
import customTheme from './theme';

// Import feature flags
import FEATURES from './config/features';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (data) => {
    setCurrentUser(data.user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // "Çok Yakında" sayfası aktifse onu göster
  if (FEATURES.SHOW_COMING_SOON) {
    return (
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <ComingSoon />
      </ThemeProvider>
    );
  }

  // Login olmamış kullanıcıları LoginScreen'e yönlendir
  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <LoginScreen onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Router>
        <Layout currentUser={currentUser} onLogout={handleLogout}>
          <Routes>
            {/* Admin Route */}
            {currentUser?.isAdmin && (
              <>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<AdminPanel />} />
              </>
            )}
            
            {/* Brand Routes */}
            {!currentUser?.isAdmin && (
              <>
                <Route path="/" element={<Navigate to="/brand-profile" replace />} />
                <Route path="/brand-profile" element={
                  (currentUser?.userType === 'brand' || currentUser?.userType === 'eventBrand') ? 
                    <BrandProfile currentUser={currentUser} setCurrentUser={setCurrentUser} /> : 
                    <Navigate to="/" replace />
                } />
                <Route path="/banners" element={
                  (currentUser?.userType === 'brand' || currentUser?.userType === 'eventBrand') ? 
                    <Banners currentUser={currentUser} /> : 
                    <Navigate to="/" replace />
                } />
                <Route path="/analytics" element={
                  (currentUser?.userType === 'brand' || currentUser?.userType === 'eventBrand') ? 
                    <Analytics currentUser={currentUser} /> : 
                    <Navigate to="/" replace />
                } />
              </>
            )}
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
