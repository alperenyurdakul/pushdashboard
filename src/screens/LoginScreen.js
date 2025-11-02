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
    email: '',
    userType: 'brand',
    category: 'Kahve',
    city: 'İstanbul'
  });

  // Kategori seçenekleri - userType'a göre
  const getCategoryOptions = () => {
    if (formData.userType === 'eventBrand') {
      return [
        { value: 'Konser', label: 'Konser' },
        { value: 'Sinema', label: 'Sinema' },
        { value: 'Tiyatro', label: 'Tiyatro' },
        { value: 'Sosyal Etkinlik', label: 'Sosyal Etkinlik' },
        { value: 'Spor Etkinliği', label: 'Spor Etkinliği' },
      ];
    }
    return [
      { value: 'Kahve', label: 'Kahve' },
      { value: 'Yiyecek', label: 'Yiyecek' },
      { value: 'Bar/Pub', label: 'Bar/Pub' },
      { value: 'Giyim', label: 'Giyim' },
      { value: 'Kuaför', label: 'Kuaför' },
      { value: 'Spor', label: 'Spor' },
      { value: 'Tatlı', label: 'Tatlı' },
      { value: 'Mobilya', label: 'Mobilya' },
      { value: 'Market', label: 'Market' },
      { value: 'Çizim', label: 'Çizim' },
      { value: 'Boyama', label: 'Boyama' },
    ];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // userType değiştiğinde kategoriyi sıfırla
      if (field === 'userType') {
        const categories = value === 'eventBrand' 
          ? ['Konser', 'Sinema', 'Tiyatro', 'Sosyal Etkinlik', 'Spor Etkinliği', 'El Sanatları']
          : ['Kahve', 'Yiyecek', 'Bar/Pub', 'Giyim', 'Kuaför', 'Spor', 'Tatlı', 'Mobilya', 'Çizim', 'Boyama'];
        newData.category = categories[0];
      }
      
      return newData;
    });
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

    if (!activeTab && !formData.email.trim()) {
      setError('E-posta gerekli!');
      return false;
    }

    if (!activeTab && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Geçerli bir e-posta adresi girin!');
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
    setFormData({ phone: '', password: '', name: '', userType: 'brand', category: 'Kahve', city: 'İstanbul' });
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
            <Box 
              component="img" 
              src="/icon.png" 
              alt="Faydana Logo" 
              sx={{ 
                width: 180, 
                height: 80, 
                mb: 2,
                objectFit: 'contain'
              }} 
            />
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
                  label="Marka Adı"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="E-posta"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  margin="normal"
                  required
                  placeholder="ornek@email.com"e
                />
                
                {/* Kullanıcı Tipi Seçimi */}
                <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                  <FormLabel component="legend">Hesap Tipi</FormLabel>
                  <RadioGroup
                    value={formData.userType}
                    onChange={(e) => handleInputChange('userType', e.target.value)}
                  >
                    <FormControlLabel 
                      value="brand" 
                      control={<Radio />} 
                      label="Marka (Kampanya Oluştur)" 
                    />
                    <FormControlLabel 
                      value="eventBrand" 
                      control={<Radio />} 
                      label="Etkinlik Markası (Etkinlik Oluştur)" 
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
                    {getCategoryOptions().map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    <strong>Önemli:</strong> Seçtiğiniz kategori daha sonra değiştirilemez!
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
                        {city}
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