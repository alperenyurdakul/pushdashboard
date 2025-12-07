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
  Grid,
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
    city: 'İstanbul',
    address: '',
    latitude: null,
    longitude: null
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
      { value: 'Petrol Ofisi', label: 'Petrol Ofisi' },
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

    // Koordinat kontrolü (sadece kayıt için)
    if (!activeTab && (!formData.latitude || !formData.longitude)) {
      setError('Enlem ve boylam koordinatları zorunludur!');
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
    setFormData({ phone: '', password: '', name: '', userType: 'brand', category: 'Kahve', city: 'İstanbul', address: '', latitude: null, longitude: null });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f0f3 0%, #ffffff 50%, #f0f0f3 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(255, 97, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 97, 94, 0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
      },
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            width: '100%',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ff615e 0%, #ff3d3a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0px 8px 24px rgba(255, 97, 94, 0.3)',
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '2rem' }}>
                F
              </Typography>
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                mb: 1,
              }}
            >
              Faydana'ya Hoş Geldin
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Kampanyalarını paylaşmaya hazır mısın?
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered 
            sx={{ 
              mb: 4,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(90deg, #ff615e 0%, #ff3d3a 100%)',
              },
            }}
          >
            <Tab 
              label="Kayıt Ol" 
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 48,
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
            <Tab 
              label="Giriş Yap" 
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 48,
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
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

                {/* Adres */}
                <TextField
                  fullWidth
                  label="Adres"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  margin="normal"
                  placeholder="Örnek: Bağdat Caddesi No:123, Kadıköy"
                  helperText="Kampanyalarınızın konumunu belirlemek için adres girin"
                />

                {/* Koordinatlar */}
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Konum Koordinatları (Zorunlu - Tüm kampanyalarınız bu koordinatları kullanacak)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Enlem (Latitude) *"
                        type="number"
                        value={formData.latitude || ''}
                        onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Örnek: 41.0082"
                        required
                        size="small"
                        inputProps={{ step: 'any' }}
                        helperText="Örnek: 41.0082"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Boylam (Longitude) *"
                        type="number"
                        value={formData.longitude || ''}
                        onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Örnek: 28.9784"
                        required
                        size="small"
                        inputProps={{ step: 'any' }}
                        helperText="Örnek: 28.9784"
                      />
                    </Grid>
                  </Grid>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      <strong>Not:</strong> Koordinatları girdiğinizde, oluşturacağınız tüm kampanyalar bu konumu kullanacaktır. 
                      Koordinatları Google Maps'ten veya başka bir harita servisinden alabilirsiniz.
                    </Typography>
                  </Alert>
                </Box>
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
              sx={{ 
                mt: 4, 
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ff615e 0%, #ff3d3a 100%)',
                boxShadow: '0px 4px 16px rgba(255, 97, 94, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff3d3a 0%, #ff1d1a 100%)',
                  boxShadow: '0px 6px 20px rgba(255, 97, 94, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #ff615e 0%, #ff3d3a 100%)',
                  opacity: 0.6,
                },
                transition: 'all 0.3s ease',
              }}
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
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
                transition: 'color 0.2s',
              }}
              onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
            >
              {activeTab === 0 
                ? 'Zaten hesabınız var mı? Giriş yapın' 
                : 'Hesabınız yok mu? Kayıt olun'
              }
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginScreen; 