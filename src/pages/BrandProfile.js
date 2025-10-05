import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

function BrandProfile({ currentUser, setCurrentUser }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editing, setEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    brandName: '',
    brandType: '',
    description: '',
    category: 'Kahve',
    phone: '',
    email: '',
    address: '',
    city: 'İstanbul',
    district: 'Kadıköy',
    logo: null
  });

  const categories = [
    'Kahve',
    'Yiyecek', 
    'Bar/Pub',
    'Giyim',
    'Kuaför'
  ];

  const brandTypes = [
    'Restoran',
    'Kafe',
    'Bar',
    'Mağaza',
    'Hizmet'
  ];

  useEffect(() => {
    // Kullanıcı bilgilerini form'a yükle
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        brandName: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Logo dosyası 5MB\'dan küçük olmalıdır!',
          severity: 'error'
        });
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Sadece resim dosyaları yüklenebilir!',
          severity: 'error'
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Preview oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.brandName.trim()) {
      setSnackbar({
        open: true,
        message: 'Marka adı gerekli!',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('brandName', formData.brandName);
      formDataToSend.append('brandType', formData.brandType);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('district', formData.district);
      
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      const response = await fetch('http://192.168.66.156:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profil güncelleme sonucu:', result);
        
        setSnackbar({
          open: true,
          message: 'Marka profili başarıyla güncellendi!',
          severity: 'success'
        });
        
        setEditing(false);
        
        // LocalStorage ve state'i güncelle
        const updatedUser = { ...currentUser, ...result.user };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        
      } else {
        const error = await response.json();
        setSnackbar({
          open: true,
          message: error.message || 'Profil güncellenirken hata oluştu!',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      setSnackbar({
        open: true,
        message: 'Profil güncellenirken hata oluştu!',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setLogoPreview(null);
    // Form'u orijinal değerlere sıfırla
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        brandName: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        logo: null
      }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Marka Profili
          </Typography>
        </Box>
        
        {!editing ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
          >
            Düzenle
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Sol Kolon - Logo ve Temel Bilgiler */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Logo ve Temel Bilgiler
              </Typography>
              
              {/* Logo Upload */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={logoPreview || (currentUser?.logo ? `http://192.168.66.156:5000/uploads/logos/${currentUser.logo}` : null)}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 60 }} />
                </Avatar>
                
                {editing && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="logo-upload"
                      type="file"
                      onChange={handleLogoUpload}
                    />
                    <label htmlFor="logo-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadIcon />}
                        size="small"
                      >
                        Logo Yükle
                      </Button>
                    </label>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Maksimum 5MB, JPG/PNG
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Marka Adı */}
              <TextField
                fullWidth
                label="Marka Adı"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                disabled={!editing}
                sx={{ mb: 2 }}
              />

              {/* Marka Tipi */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Marka Tipi</InputLabel>
                <Select
                  value={formData.brandType}
                  label="Marka Tipi"
                  onChange={(e) => handleInputChange('brandType', e.target.value)}
                  disabled={!editing}
                >
                  {brandTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Kategori */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={formData.category}
                  label="Kategori"
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={!editing}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ Kolon - Detaylı Bilgiler */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detaylı Bilgiler
              </Typography>
              
              <Grid container spacing={2}>
                {/* Açıklama */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Marka Açıklaması"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!editing}
                    placeholder="Markanız hakkında kısa bir açıklama yazın..."
                  />
                </Grid>

                {/* İletişim Bilgileri */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      İletişim Bilgileri
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="E-posta"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>

                {/* Adres Bilgileri */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Adres Bilgileri
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adres"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!editing}
                    placeholder="Detaylı adres bilgisi..."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Şehir"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="İlçe"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BrandProfile;
