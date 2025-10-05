import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  CardActions,
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit,
  Delete,
  Create,
  CheckCircle,
  Schedule,
  Image,
  Error,
} from '@mui/icons-material';

function Banners({ currentUser }) {
  const [banners, setBanners] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [generateCodeDialogOpen, setGenerateCodeDialogOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Form açıldığında mevcut marka bilgilerini yükle
  const handleOpenCreateDialog = () => {
    console.log('🔢 Dialog açılırken currentUser:', currentUser);
    console.log('🔢 Dialog açılırken formData.codeQuota:', formData.codeQuota);
    setFormData({
      campaignDescription: '',
      targetAudience: 'Genel kitle',
      category: 'Kahve',
      codeQuota: 10,
      location: {
        city: 'İstanbul',
        district: 'Kadıköy',
        address: ''
      },
      brandInfo: {
        name: currentUser.name, // Otomatik doldurulacak
        type: 'restaurant',
        description: ''
      }
    });
    setCreateDialogOpen(true);
  };
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    campaignDescription: '',
    targetAudience: 'Genel kitle',
    category: 'Kahve',
    codeQuota: 10,
    location: {
      city: 'İstanbul',
      district: 'Kadıköy',
      address: ''
    },
    brandInfo: {
      name: '',
      type: '',
      description: ''
    }
  });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Banner'ları backend'den çek
  const loadBanners = async () => {
    try {
      console.log('Dashboard - currentUser:', currentUser);
      console.log('Dashboard - restaurantName:', currentUser?.name);
      
      const response = await fetch(`http://192.168.66.156:5000/api/ai/banners`);
      const data = await response.json();
      
      console.log('Dashboard - Backend response:', data);
      
      if (data.success) {
        setBanners(data.data);
      } else {
        console.error('Banner yükleme hatası:', data.message);
        setBanners([]);
      }
    } catch (error) {
      console.error('Banner yükleme hatası:', error);
      setBanners([]);
    }
  };

  useEffect(() => {
    if (currentUser?.name) {
      loadBanners();
    }
  }, [currentUser]);


  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'completed':
        return <Image color="primary" />;
      default:
        return <Error color="error" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'primary';
      default:
        return 'error';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'pending':
        return 'Beklemede';
      case 'completed':
        return 'Tamamlandı';
      default:
        return 'Hata';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateBanner = async () => {
    if (!formData.campaignDescription.trim()) {
      setSnackbar({
        open: true,
        message: 'Kampanya açıklaması gerekli!',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🔢 Dashboard - Gönderilecek kod kotası:', formData.codeQuota);
      const response = await fetch('http://192.168.66.156:5000/api/ai/generate-banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          restaurantName: currentUser.name,
          campaignDescription: formData.campaignDescription,
          targetAudience: formData.targetAudience,
          location: formData.location,
          brandInfo: {
            ...formData.brandInfo,
            name: currentUser.name
          },
          category: formData.category,
          codeQuota: formData.codeQuota
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Banner oluşturma sonucu:', result);
        
        if (result.success) {
          // Yeni banner'ı listeye ekle
          const newBanner = result.data;
          console.log('Yeni banner eklendi:', newBanner);
          
          // Banner listesini backend'den yeniden çek
          loadBanners();
          setCreateDialogOpen(false);
          
          // Form'u temizle
          setFormData({
            campaignDescription: '',
            targetAudience: 'Genel kitle',
            category: 'Kahve',
            codeQuota: 10,
            location: {
              city: 'İstanbul',
              district: 'Genel',
              address: ''
            },
            brandInfo: {
              name: currentUser.name, // Otomatik doldurulacak
              type: 'restaurant',
              description: ''
            }
          });
          
          alert('Banner başarıyla oluşturuldu!');
        } else {
          alert(`Banner oluşturulurken hata: ${result.message}`);
        }
      } else {
        const errorData = await response.json();
        alert(`Banner oluşturulurken hata: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Banner oluşturma hatası:', error);
      setSnackbar({
        open: true,
        message: `Banner oluşturma hatası: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleVerifyCode = (banner) => {
    setSelectedBanner(banner);
    setVerifyDialogOpen(true);
  };

  const handleGenerateCode = async () => {
    try {
      // Restoran ID'sini bul (currentUser'dan)
      const restaurantId = currentUser?.restaurantId || currentUser?.id;
      if (!restaurantId) {
        setSnackbar({
          open: true,
          message: 'Restoran ID bulunamadı',
          severity: 'error'
        });
        return;
      }

      const response = await fetch('http://192.168.66.156:5000/api/ai/generate-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurantId
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedCode(result.data.verificationCode);
        setGenerateCodeDialogOpen(true);
        setSnackbar({
          open: true,
          message: 'Doğrulama kodu oluşturuldu!',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Kod oluşturma başarısız',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Kod oluşturma hatası:', error);
      setSnackbar({
        open: true,
        message: 'Sunucu hatası',
        severity: 'error'
      });
    }
  };

  const handleVerifyCodeSubmit = async () => {
    if (!selectedBanner || !verifyCode) {
      setSnackbar({
        open: true,
        message: 'Lütfen doğrulanacak kodu girin',
        severity: 'error'
      });
      return;
    }

    try {
      // Müşteri kodunu doğrula
      const response = await fetch('http://192.168.66.156:5000/api/ai/verify-customer-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: verifyCode,
          bannerId: selectedBanner._id
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSnackbar({
          open: true,
          message: `Kod başarıyla doğrulandı! Müşteri: ${result.data.customerPhone}`,
          severity: 'success'
        });
        
        setVerifyDialogOpen(false);
        setVerifyCode('');
        
        // Banner listesini yenile (istatistikler güncellenmiş olabilir)
        loadBanners();
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Kod doğrulama başarısız',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Kod doğrulama hatası:', error);
      setSnackbar({
        open: true,
        message: 'Sunucu hatası',
        severity: 'error'
      });
    }
  };

  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.status === 'active').length;
  const totalViews = banners.reduce((sum, b) => sum + b.stats.views, 0);
  const totalClicks = banners.reduce((sum, b) => sum + b.stats.clicks, 0);

  // Banner silme fonksiyonu
  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Bu banner\'ı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://192.168.66.156:5000/api/ai/banners/${bannerId}?restaurantName=${encodeURIComponent(currentUser.name)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Banner listesini yenile
        loadBanners();
        alert('Banner başarıyla silindi!');
      } else {
        const errorData = await response.json();
        alert(`Banner silinirken hata: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Banner silme hatası:', error);
      alert('Banner silinirken bir hata oluştu');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Bannerlar
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<Create />}
            onClick={handleOpenCreateDialog}
            sx={{ mr: 2 }}
          >
            Bildirim Oluştur
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGenerateCode}
            sx={{ mr: 2 }}
          >
            🔑 Kod Oluştur
          </Button>
          <Button
            variant="outlined"
            onClick={loadBanners}
          >
            🔄 Yenile
          </Button>
        </Box>
      </Box>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Banner
              </Typography>
              <Typography variant="h4">{totalBanners}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Aktif Banner
              </Typography>
              <Typography variant="h4" color="success.main">{activeBanners}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Görüntülenme
              </Typography>
              <Typography variant="h4">{totalViews.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Tıklama
              </Typography>
              <Typography variant="h4">{totalClicks.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Banner Tablosu */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Durum</TableCell>
              <TableCell>Başlık</TableCell>
              <TableCell>Restoran</TableCell>
              <TableCell>AI Metin</TableCell>
              <TableCell>İstatistikler</TableCell>
              <TableCell>Kod Kotası</TableCell>
              <TableCell>Oluşturulma</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">
                    Henüz banner oluşturulmamış. İlk banner'ınızı oluşturmak için "Yeni AI Banner" butonuna tıklayın.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => {
                console.log('Banner bilgileri:', {
                  id: banner.id,
                  _id: banner._id,
                  title: banner.title,
                  restaurant: banner.restaurant?.name,
                  completeBanner: banner
                });
                
                return (
                  <TableRow key={banner._id || banner.id}>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(banner.status)}
                        label={getStatusText(banner.status)}
                        color={getStatusColor(banner.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {banner.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {banner.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {banner.restaurant?.name || 'Bilinmeyen'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {banner.restaurant?.type || 'restaurant'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {banner.aiGeneratedText}
                      </Typography>
                      {banner.bannerImage && (
                        <Box sx={{ mt: 1 }}>
                          <img 
                            src={banner.bannerImage} 
                            alt="Banner" 
                            style={{ 
                              width: '100%', 
                              maxWidth: 200, 
                              height: 'auto',
                              borderRadius: '8px',
                              border: '1px solid #ddd',
                              cursor: 'pointer'
                            }} 
                            onClick={() => window.open(banner.bannerImage, '_blank')}
                            title="Büyütmek için tıklayın"
                          />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        👁️ {banner.stats?.views || 0} | 👆 {banner.stats?.clicks || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {banner.codeQuota?.used || 0} / {banner.codeQuota?.total || 10}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(banner.createdAt).toLocaleDateString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" title="Görüntüle" onClick={() => {
                        setSelectedBanner(banner);
                        setDetailDialogOpen(true);
                      }}>
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="success"
                        title="Kod Doğrula"
                        onClick={() => handleVerifyCode(banner)}
                      >
                        <CheckCircle />
                      </IconButton>
                      <CardActions>
                        <IconButton size="small" title="Düzenle">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          title="Sil" 
                          onClick={() => {
                            const bannerId = banner._id || banner.id;
                            console.log('Silme butonuna tıklandı:', {
                              bannerId: bannerId,
                              bannerTitle: banner.title,
                              restaurantName: banner.restaurant?.name,
                              availableFields: Object.keys(banner)
                            });
                            if (bannerId) {
                              handleDeleteBanner(bannerId);
                            } else {
                              alert('Banner ID bulunamadı!');
                            }
                          }}
                          sx={{ 
                            color: '#f44336',
                            '&:hover': { 
                              backgroundColor: 'rgba(244, 67, 54, 0.1)' 
                            } 
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </CardActions>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Banner Oluşturma Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          🎨 Yeni AI Banner Oluştur
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              <strong>Marka:</strong> {currentUser?.name}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kampanya Açıklaması"
                  multiline
                  rows={4}
                  placeholder="Örnek: Saat 18:00'dan sonra kahve alana cheesecake ücretsiz!"
                  value={formData.campaignDescription}
                  onChange={(e) => handleInputChange('campaignDescription', e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={formData.category}
                    label="Kategori"
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <MenuItem value="Kahve">Kahve</MenuItem>
                    <MenuItem value="Yiyecek">Yiyecek</MenuItem>
                    <MenuItem value="Bar/Pub">Bar/Pub</MenuItem>
                    <MenuItem value="Giyim">Giyim</MenuItem>
                    <MenuItem value="Kuaför">Kuaför</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Kod Kotası (Toplam Kod Sayısı)"
                  type="number"
                  value={formData.codeQuota}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('🔢 Dashboard - Kod kotası değişti:', value);
                    handleInputChange('codeQuota', value);
                  }}
                  inputProps={{ min: 1, max: 1000 }}
                  helperText="Bu kampanya için kaç adet kod oluşturulabileceğini belirleyin"
                  sx={{ mb: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Hedef Kitle</InputLabel>
                  <Select
                    value={formData.targetAudience}
                    label="Hedef Kitle"
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  >
                    <MenuItem value="Genel kitle">Genel kitle</MenuItem>
                    <MenuItem value="Gençler (18-25)">Gençler (18-25)</MenuItem>
                    <MenuItem value="Yetişkinler (25-45)">Yetişkinler (25-45)</MenuItem>
                    <MenuItem value="Aileler">Aileler</MenuItem>
                    <MenuItem value="Öğrenciler">Öğrenciler</MenuItem>
                    <MenuItem value="Çalışanlar">Çalışanlar</MenuItem>
                  </Select>
                </FormControl>

                {/* Lokasyon Bilgileri */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  📍 Lokasyon Bilgileri
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Şehir"
                      value={formData.location.city}
                      onChange={(e) => handleInputChange('location', { ...formData.location, city: e.target.value })}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="İlçe"
                      value={formData.location.district}
                      onChange={(e) => handleInputChange('location', { ...formData.location, district: e.target.value })}
                      size="small"
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Detaylı Adres"
                  placeholder="Örnek: Bağdat Caddesi No:123"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location', { ...formData.location, address: e.target.value })}
                  size="small"
                  sx={{ mb: 2 }}
                />

                {/* Marka Bilgileri */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  🏪 Marka Bilgileri
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Marka Adı"
                      value={currentUser?.name || ''}
                      disabled
                      helperText="Bu alan otomatik olarak doldurulur ve değiştirilemez"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Marka Türü"
                      value={formData.brandInfo.type || 'restaurant'}
                      onChange={(e) => handleInputChange('brandInfo', { ...formData.brandInfo, type: e.target.value })}
                      size="small"
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Marka Açıklaması"
                  placeholder="Örnek: Lezzetli yemekler ve sıcak ortam"
                  value={formData.brandInfo.description}
                  onChange={(e) => handleInputChange('brandInfo', { ...formData.brandInfo, description: e.target.value })}
                  multiline
                  rows={2}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  🎯 AI Önizleme
                </Typography>
                {formData.campaignDescription && (
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid #ddd', 
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9',
                    minHeight: 200
                  }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {formData.brandInfo.name || currentUser?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: 'textSecondary' }}>
                      {formData.brandInfo.type || 'restaurant'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {formData.campaignDescription}
                    </Typography>
                    
                    <Box sx={{ mb: 2, p: 1, backgroundColor: '#fff', borderRadius: 1 }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                        �� {formData.location.city}, {formData.location.district}
                      </Typography>
                      {formData.location.address && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          {formData.location.address}
                        </Typography>
                      )}
                    </Box>
                    
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                      Hedef: {formData.targetAudience}
                    </Typography>
                    
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="primary">
                        ✨ AI bu bilgilere göre etkileyici bir banner oluşturacak!
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            İptal
          </Button>
          <Button
            onClick={handleCreateBanner}
            variant="contained"
            disabled={loading || !formData.campaignDescription.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Create />}
          >
            {loading ? 'Oluşturuluyor...' : 'AI Banner Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Banner Detay Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          🎨 Banner Detayı
        </DialogTitle>
        <DialogContent>
          {selectedBanner && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    {selectedBanner.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {selectedBanner.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    AI Metin:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: 1,
                    whiteSpace: 'pre-line'
                  }}>
                    {selectedBanner.aiGeneratedText}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    İstatistikler:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Chip label={`👁️ ${selectedBanner.stats.views}`} size="small" />
                    <Chip label={`👆 ${selectedBanner.stats.clicks}`} size="small" />
                    <Chip label={`🎯 ${selectedBanner.stats.conversions}`} size="small" />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Banner Görseli:
                  </Typography>
                  {selectedBanner.bannerImage ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <img 
                        src={selectedBanner.bannerImage} 
                        alt="Banner" 
                        style={{ 
                          width: '100%', 
                          maxWidth: 400, 
                          height: 'auto',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }} 
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = selectedBanner.bannerImage;
                          link.download = `banner-${selectedBanner._id}.png`;
                          link.click();
                        }}
                      >
                        📥 PNG İndir
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Görsel bulunamadı
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Doğrulama Kodu Oluşturma Dialog */}
      <Dialog open={generateCodeDialogOpen} onClose={() => setGenerateCodeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>🔑 Doğrulama Kodu Oluşturuldu</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Doğrulama kodu başarıyla oluşturuldu! Bu kodu müşterilerinize vererek kampanyalarınızı kullanmalarını sağlayabilirsiniz.
            </Alert>
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                {generatedCode}
              </Typography>
            </Box>
            <Alert severity="info">
              Bu kodu müşterilerinize verin. Müşteriler bu kodu kullanarak kampanyanızı aktifleştirebilir.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateCodeDialogOpen(false)}>
            Kapat
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              setSnackbar({
                open: true,
                message: 'Kod panoya kopyalandı!',
                severity: 'success'
              });
            }}
          >
            📋 Kopyala
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kod Doğrulama Dialog */}
      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Kod Doğrula - {selectedBanner?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Müşteri Kodu"
              placeholder="6 haneli kodu girin"
              variant="outlined"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              inputProps={{ maxLength: 6 }}
              sx={{ mb: 2 }}
            />
            <Alert severity="info" sx={{ mb: 2 }}>
              Müşteri size verdiği 6 haneli kodu buraya girin. Kod doğruysa indirim uygulanacak.
            </Alert>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Banner Bilgileri:
              </Typography>
              <Typography variant="body2">
                • Kategori: {selectedBanner?.category || 'Kahve'}
              </Typography>
              <Typography variant="body2">
                • Kod Kotası: {selectedBanner?.codeQuota?.used || 0} / {selectedBanner?.codeQuota?.total || 10}
              </Typography>
              <Typography variant="body2">
                • Açıklama: {selectedBanner?.description}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>İptal</Button>
          <Button variant="contained" color="success" onClick={handleVerifyCodeSubmit}>
            Kodu Doğrula ve İndirim Uygula
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Banners; 