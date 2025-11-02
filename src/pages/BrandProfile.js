import React, { useState, useEffect } from 'react';
import API_CONFIG from '../config/api';
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
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Storefront as StorefrontIcon,
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

  const campaignCategories = [
    'Kahve',
    'Yiyecek', 
    'Bar/Pub',
    'Giyim',
    'Kuaför',
    'Spor',
    'Tatlı',
    'Mobilya',
    'Market',
    'Çizim',
    'Boyama'
  ];

  const eventCategories = [
    'Konser',
    'Sinema',
    'Tiyatro',
    'Sosyal Etkinlik',
    'Spor Etkinliği',
    'El Sanatları'
  ];

  // Kullanıcının türüne göre kategori listesini belirle
  const categories = currentUser?.userType === 'eventBrand' ? eventCategories : campaignCategories;

  const brandTypes = [
    'Restoran',
    'Kafe',
    'Bar',
    'Mağaza',
    'Hizmet',
    'Spor',
    'Atölye',
    'Sanat Merkezi'
  ];

  useEffect(() => {
    // Kullanıcı bilgilerini form'a yükle
    if (currentUser) {
      // Kategori belirleme - userType'a göre varsayılan
      let defaultCategory = currentUser.category;
      if (!defaultCategory) {
        defaultCategory = currentUser.userType === 'eventBrand' ? 'Konser' : 'Kahve';
      }
      
      
      setFormData(prev => ({
        ...prev,
        brandName: currentUser.name || '',
        brandType: currentUser.brandType || '',
        description: currentUser.description || '',
        category: defaultCategory,
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        city: currentUser.city || 'İstanbul',
        district: currentUser.district || 'Kadıköy',
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

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/update-profile`, {
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
      // Kategori belirleme - userType'a göre varsayılan
      let defaultCategory = currentUser.category;
      if (!defaultCategory) {
        defaultCategory = currentUser.userType === 'eventBrand' ? 'Konser' : 'Kahve';
      }
      
      setFormData({
        brandName: currentUser.name || '',
        brandType: currentUser.brandType || '',
        description: currentUser.description || '',
        category: defaultCategory,
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        city: currentUser.city || 'İstanbul',
        district: currentUser.district || 'Kadıköy',
        logo: null
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StorefrontIcon sx={{ mr: 2, fontSize: 32, color: '#28A745' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#212529' }}>
            Marka Profili
          </Typography>
        </Box>
        
        {!editing ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
            sx={{
              backgroundColor: '#28A745',
              '&:hover': {
                backgroundColor: '#1E7E34',
              },
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Düzenle
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
              disabled={loading}
              sx={{
                borderColor: '#E9ECEF',
                color: '#6C757D',
                '&:hover': {
                  borderColor: '#28A745',
                  color: '#28A745',
                  backgroundColor: '#E6F7ED',
                },
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              İptal
            </Button>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSaveProfile}
              disabled={loading}
              sx={{
                backgroundColor: '#28A745',
                '&:hover': {
                  backgroundColor: '#1E7E34',
                },
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Sol Kolon - Logo ve Temel Bilgiler */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E9ECEF',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#212529',
                mb: 3,
                fontSize: '1.25rem'
              }}>
                Logo ve Temel Bilgiler
              </Typography>
              
              {/* Logo Upload */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar
                  src={
                    logoPreview
                      || (currentUser?.logo
                        ? (currentUser.logo.startsWith('http')
                            ? currentUser.logo
                            : `${API_CONFIG.BASE_URL}/uploads/logos/${currentUser.logo}`)
                        : null)
                  }
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    border: '3px solid',
                    borderColor: '#E9ECEF',
                    backgroundColor: '#F8F9FA',
                    '& img': {
                      objectFit: 'contain'
                    }
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 60, color: '#6C757D' }} />
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
                disabled={true}
                sx={{ mb: 2 }}
              />
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 2,
                  backgroundColor: '#E6F7ED',
                  border: '1px solid #28A745',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#28A745',
                  },
                  '& .MuiAlert-message': {
                    color: '#212529',
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  ℹ️ Marka adı kayıt sırasında seçilmiştir ve değiştirilemez
                </Typography>
              </Alert>

              {/* Kategori */}
              <TextField
                fullWidth
                label="Kategori"
                value={formData.category || (currentUser?.userType === 'eventBrand' ? 'Konser' : 'Kahve')}
                disabled={true}
                sx={{ 
                  mb: 2,
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                  }
                }}
              />
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 2,
                  backgroundColor: '#FFF3CD',
                  border: '1px solid #FFC107',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#FFC107',
                  },
                  '& .MuiAlert-message': {
                    color: '#856404',
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  ⚠️ Kategori kayıt sırasında seçilmiştir ve değiştirilemez
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ Kolon - Detaylı Bilgiler */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E9ECEF',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#212529',
                mb: 3,
                fontSize: '1.25rem'
              }}>
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
