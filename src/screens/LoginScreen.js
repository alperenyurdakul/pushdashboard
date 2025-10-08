import React, { useState } from 'react';
import API_CONFIG from '../config/api';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Tabs,
  Tab,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  Restaurant,
  Phone,
  Lock,
  Person,
} from '@mui/icons-material';

const CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Gaziantep',
  'Konya',
  'Kocaeli',
  'Mersin',
  'Samsun',
  'Eskişehir',
  'Diyarbakır',
  'Kayseri',
  'Denizli',
];

function LoginScreen({ onLogin }) {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    userType: 'customer',
    category: 'Kahve',
    city: 'İstanbul'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.phone.trim()) {
      setError('Telefon numarası gerekli!');
      return false;
    }

    if (!formData.password.trim()) {
      setError('Şifre gerekli!');
      return false;
    }

    if (!activeTab && !formData.name.trim()) {
      setError('İsim gerekli!');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = activeTab === 0 ? '/api/auth/register' : '/api/auth/login';
      const body = activeTab === 0 ? formData : { phone: formData.phone, password: formData.password };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('userToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        
        if (onLogin) {
          onLogin(data.data);
        }
      } else {
        setError(data.message || 'Bir hata oluştu!');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Bağlantı hatası! Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setFormData({ phone: '', password: '', name: '', userType: 'customer', category: 'Kahve', city: 'İstanbul' });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Restaurant sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Faydana
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Kampanyalarını paylaşmaya hazır mısın?
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
            <Tab label="Kayıt Ol" />
            <Tab label="Giriş Yap" />
          </Tabs>

          {/* Form */}
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {/* Telefon Numarası */}
            <TextField
              fullWidth
              label="Telefon Numarası"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            {/* Şifre */}
            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            {/* Kayıt modunda isim */}
            {activeTab === 0 && (
              <>
                <TextField
                  fullWidth
                  label="Restoran/Marka Adı"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                
                {/* Kullanıcı Tipi Seçimi */}
                <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                  <FormLabel component="legend">Hesap Tipi</FormLabel>
                  <RadioGroup
                    row
                    value={formData.userType}
                    onChange={(e) => handleInputChange('userType', e.target.value)}
                  >
                    <FormControlLabel 
                      value="brand" 
                      control={<Radio />} 
                      label="🏪 Marka (Kampanya Oluştur)" 
                    />
                  </RadioGroup>
                </FormControl>

                {/* Kategori Seçimi */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Kategori *</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    label="Kategori *"
                    required
                  >
                    <MenuItem value="Kahve">☕ Kahve</MenuItem>
                    <MenuItem value="Yiyecek">🍽️ Yiyecek</MenuItem>
                    <MenuItem value="Bar/Pub">🍺 Bar/Pub</MenuItem>
                    <MenuItem value="Giyim">👕 Giyim</MenuItem>
                    <MenuItem value="Kuaför">✂️ Kuaför</MenuItem>
                  </Select>
                </FormControl>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    ⚠️ <strong>Önemli:</strong> Seçtiğiniz kategori daha sonra değiştirilemez!
                  </Typography>
                </Alert>

                {/* Şehir Seçimi */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Şehir *</InputLabel>
                  <Select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    label="Şehir *"
                    required
                  >
                    {CITIES.map((city) => (
                      <MenuItem key={city} value={city}>
                        📍 {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {/* Hata Mesajı */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                activeTab === 0 ? 'Hesap Oluştur' : 'Giriş Yap'
              )}
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="textSecondary">
              {activeTab === 0 
                ? 'Zaten hesabınız var mı? Giriş yapın' 
                : 'Hesabınız yok mu? Kayıt olun'
              }
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginScreen; 