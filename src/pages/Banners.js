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
import API_CONFIG from '../config/api';
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [generateCodeDialogOpen, setGenerateCodeDialogOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Form açıldığında mevcut marka bilgilerini yükle
  const handleOpenCreateDialog = () => {
    console.log('🔢 Dialog açılırken currentUser:', currentUser);
    console.log('📍 Dialog açılırken koordinatlar:', { 
      latitude: currentUser?.latitude, 
      longitude: currentUser?.longitude 
    });
    console.log('🔢 Dialog açılırken formData.codeQuota:', formData.codeQuota);
    
    // Kullanıcının kategorisini belirle
    let defaultCategory = currentUser?.category;
    if (!defaultCategory) {
      // Kategori yoksa userType'a göre ilk kategoriyi seç
      defaultCategory = currentUser?.userType === 'eventBrand' ? 'Konser' : 'Kahve';
    }
    
    setFormData({
      title: '',
      campaignDescription: '',
      targetAudience: 'Genel kitle',
      category: defaultCategory, // Kullanıcının kategorisi otomatik seçili
      codeQuota: 10,
      codeType: 'random', // Varsayılan olarak random
      fixedCode: '',
      offerType: 'percentage',
      discountPercentage: 20,
      originalPrice: '',
      discountedPrice: '',
      freeItemName: '',
      freeItemCondition: '',
      startDate: new Date().toISOString().split('T')[0], // Bugünün tarihi
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 gün sonrası
      startTime: '09:00',
      endTime: '23:00',
      location: {
        city: currentUser?.city || 'İstanbul',
        district: currentUser?.district || 'Kadıköy',
        address: currentUser?.address || '',
        coordinates: currentUser?.latitude && currentUser?.longitude ? {
          lat: currentUser.latitude,
          lng: currentUser.longitude
        } : null,
        coordinates: { 
          latitude: currentUser?.latitude || null, 
          longitude: currentUser?.longitude || null 
        }
      },
      brandInfo: {
        name: currentUser?.name || '', // Otomatik doldurulacak
        type: currentUser?.brandType || 'restaurant',
        description: currentUser?.description || ''
      },
      menu: {
        link: '',
        image: null
      },
      bannerImage: null
    });
    setCreateDialogOpen(true);
  };
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // İlk formData - currentUser'a göre dinamik
  const getInitialFormData = () => {
    const defaultCategory = currentUser?.category || (currentUser?.userType === 'eventBrand' ? 'Çizim' : 'Kahve');
    return {
      title: '',
      campaignDescription: '',
      targetAudience: 'Genel kitle',
      category: defaultCategory,
      codeQuota: 10,
      codeType: 'random',
      fixedCode: '',
      offerType: 'percentage', // percentage, fixedPrice, freeItem
      discountPercentage: 20,
      originalPrice: '',
      discountedPrice: '',
      freeItemName: '',
      freeItemCondition: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '23:00',
      location: {
        city: currentUser?.city || 'İstanbul',
        district: currentUser?.district || 'Kadıköy',
        address: '',
        coordinates: { latitude: null, longitude: null }
      },
      brandInfo: {
        name: currentUser?.name || '',
        type: currentUser?.brandType || 'restaurant',
        description: currentUser?.description || ''
      },
      menu: {
        link: '',
        image: null
      }
    };
  };
  
  const [formData, setFormData] = useState(getInitialFormData());
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Banner'ları backend'den çek - sadece kendi banner'larını
  const loadBanners = async () => {
    try {
      console.log('Dashboard - currentUser:', currentUser);
      console.log('Dashboard - restaurantName:', currentUser?.name);
      
      // Sadece kendi banner'larını çek
      const restaurantName = encodeURIComponent(currentUser?.name || '');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/banners?restaurantName=${restaurantName}`);
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


  const getStatusIcon = (approvalStatus) => {
    switch (approvalStatus) {
      case 'approved':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'rejected':
        return <Error color="error" />;
      default:
        return <Schedule color="warning" />;
    }
  };

  const getStatusColor = (approvalStatus) => {
    switch (approvalStatus) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = (approvalStatus) => {
    switch (approvalStatus) {
      case 'approved':
        return 'Aktif';
      case 'pending':
        return 'Onay Bekliyor';
      case 'rejected':
        return 'Reddedildi';
      default:
        return 'Onay Bekliyor';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenEditDialog = (banner) => {
    setEditingBanner(banner);
    
    // Banner verilerini formData'ya yükle
    const campaign = banner.campaign || {};
    const offerDetails = banner.offerDetails || {};
    const codeSettings = banner.codeSettings || {};
    
    setFormData({
      title: banner.title || '',
      campaignDescription: banner.description || '',
      targetAudience: banner.targetAudience || 'Genel kitle',
      category: banner.category || currentUser?.category || 'Kahve',
      codeQuota: banner.codeQuota?.total || 10,
      codeType: codeSettings.codeType || 'random',
      fixedCode: codeSettings.fixedCode || '',
      offerType: banner.offerType || 'percentage',
      discountPercentage: offerDetails.discountPercentage || 20,
      originalPrice: offerDetails.originalPrice || '',
      discountedPrice: offerDetails.discountedPrice || '',
      freeItemName: offerDetails.freeItemName || '',
      freeItemCondition: offerDetails.freeItemCondition || '',
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: campaign.startTime || '09:00',
      endTime: campaign.endTime || '23:00',
      location: {
        city: banner.bannerLocation?.city || currentUser?.city || 'İstanbul',
        district: banner.bannerLocation?.district || currentUser?.district || 'Kadıköy',
        address: banner.bannerLocation?.address || currentUser?.address || '',
        coordinates: {
          latitude: banner.bannerLocation?.coordinates?.latitude || currentUser?.latitude || null,
          longitude: banner.bannerLocation?.coordinates?.longitude || currentUser?.longitude || null
        }
      },
      brandInfo: {
        name: currentUser?.name || '',
        type: currentUser?.brandType || 'restaurant',
        description: currentUser?.description || ''
      },
      menu: banner.menu || {
        link: '',
        image: null
      },
      bannerImage: banner.bannerImage || null
    });
    
    setEditDialogOpen(true);
  };

  const handleUpdateBanner = async () => {
    if (!formData.title.trim()) {
      setSnackbar({
        open: true,
        message: 'Kampanya başlığı gerekli!',
        severity: 'error'
      });
      return;
    }

    if (!formData.campaignDescription.trim()) {
      setSnackbar({
        open: true,
        message: 'Kampanya açıklaması gerekli!',
        severity: 'error'
      });
      return;
    }

    // Sabit kod validasyonu
    if (formData.codeType === 'fixed') {
      if (!formData.fixedCode || formData.fixedCode.length < 4 || formData.fixedCode.length > 20) {
        setSnackbar({
          open: true,
          message: 'Sabit kod 4-20 karakter arası olmalıdır!',
          severity: 'error'
        });
        return;
      }
      if (!/^[a-zA-Z0-9]+$/.test(formData.fixedCode)) {
        setSnackbar({
          open: true,
          message: 'Sabit kod sadece harf ve rakam içerebilir!',
          severity: 'error'
        });
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/banners/${editingBanner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.campaignDescription,
          targetAudience: formData.targetAudience,
          category: formData.category,
          codeQuota: {
            total: formData.codeQuota,
            used: editingBanner.codeQuota?.used || 0,
            remaining: formData.codeQuota - (editingBanner.codeQuota?.used || 0)
          },
          codeSettings: {
            codeType: formData.codeType,
            fixedCode: formData.codeType === 'fixed' ? formData.fixedCode : null
          },
          offerType: formData.offerType,
          offerDetails: {
            discountPercentage: formData.offerType === 'percentage' ? formData.discountPercentage : null,
            originalPrice: formData.offerType === 'fixedPrice' ? parseFloat(formData.originalPrice) : null,
            discountedPrice: formData.offerType === 'fixedPrice' ? parseFloat(formData.discountedPrice) : null,
            freeItemName: formData.offerType === 'freeItem' ? formData.freeItemName : null,
            freeItemCondition: formData.offerType === 'freeItem' ? formData.freeItemCondition : null
          },
          campaign: {
            startDate: formData.startDate,
            endDate: formData.endDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            daysOfWeek: editingBanner.campaign?.daysOfWeek || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            isActive: true
          },
          bannerLocation: {
            city: formData.location.city,
            district: formData.location.district,
            address: formData.location.address,
            coordinates: formData.location.coordinates.latitude && formData.location.coordinates.longitude ? {
              latitude: formData.location.coordinates.latitude,
              longitude: formData.location.coordinates.longitude
            } : null
          },
          menu: formData.menu,
          bannerImage: formData.bannerImage,
          approvalStatus: 'pending' // Düzenleme sonrası admin onayına gönder
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSnackbar({
            open: true,
            message: 'Banner başarıyla güncellendi! Admin onayı bekleniyor.',
            severity: 'success'
          });
          loadBanners();
          setEditDialogOpen(false);
          setEditingBanner(null);
        } else {
          setSnackbar({
            open: true,
            message: result.message || 'Banner güncellenirken hata oluştu!',
            severity: 'error'
          });
        }
      } else {
        const error = await response.json();
        setSnackbar({
          open: true,
          message: error.message || 'Banner güncellenirken hata oluştu!',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Banner güncelleme hatası:', error);
      setSnackbar({
        open: true,
        message: 'Banner güncellenirken hata oluştu!',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBanner = async () => {
    if (!formData.title.trim()) {
      setSnackbar({
        open: true,
        message: 'Kampanya başlığı gerekli!',
        severity: 'error'
      });
      return;
    }

    if (!formData.campaignDescription.trim()) {
      setSnackbar({
        open: true,
        message: 'Kampanya açıklaması gerekli!',
        severity: 'error'
      });
      return;
    }

    // Sabit kod validasyonu
    if (formData.codeType === 'fixed') {
      if (!formData.fixedCode || formData.fixedCode.length < 4 || formData.fixedCode.length > 20) {
        setSnackbar({
          open: true,
          message: 'Sabit kod 4-20 karakter arası olmalıdır!',
          severity: 'error'
        });
        return;
      }
      if (!/^[a-zA-Z0-9]+$/.test(formData.fixedCode)) {
        setSnackbar({
          open: true,
          message: 'Sabit kod sadece harf ve rakam içerebilir!',
          severity: 'error'
        });
        return;
      }
    }

    setLoading(true);
    try {
      console.log('🔢 Dashboard - Gönderilecek kod kotası:', formData.codeQuota);
      console.log('🔒 Dashboard - Kod tipi:', formData.codeType);
      console.log('🔑 Dashboard - Sabit kod:', formData.codeType === 'fixed' ? formData.fixedCode : 'N/A');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/generate-banner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          restaurantName: currentUser.name,
          title: formData.title,
          campaignDescription: formData.campaignDescription,
          targetAudience: formData.targetAudience,
          location: formData.location,
          brandInfo: {
            ...formData.brandInfo,
            name: currentUser.name
          },
          category: formData.category,
          codeQuota: formData.codeQuota,
          codeSettings: {
            codeType: formData.codeType,
            fixedCode: formData.codeType === 'fixed' ? formData.fixedCode : null
          },
          offerType: formData.offerType,
          offerDetails: {
            discountPercentage: formData.offerType === 'percentage' ? formData.discountPercentage : null,
            originalPrice: formData.offerType === 'fixedPrice' ? parseFloat(formData.originalPrice) : null,
            discountedPrice: formData.offerType === 'fixedPrice' ? parseFloat(formData.discountedPrice) : null,
            freeItemName: formData.offerType === 'freeItem' ? formData.freeItemName : null,
            freeItemCondition: formData.offerType === 'freeItem' ? formData.freeItemCondition : null
          },
          campaign: {
            startDate: formData.startDate,
            endDate: formData.endDate,
            startTime: formData.startTime,
            endTime: formData.endTime
          },
          menu: formData.menu,
          bannerImage: formData.bannerImage
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Banner oluşturma sonucu:', result);
        
        if (result.success) {
          // Yeni banner'ı listeye ekle
          const newBanner = result.data;
          console.log('Yeni banner eklendi:', newBanner);
          
          // Kullanıcının kredisini güncelle
          if (result.remainingCredits !== undefined) {
            const updatedUser = { ...currentUser, credits: result.remainingCredits };
            // Local storage'ı güncelle
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            storedUser.credits = result.remainingCredits;
            localStorage.setItem('user', JSON.stringify(storedUser));
            // Parent component'e bildir (eğer bir callback varsa)
            window.location.reload(); // Sayfayı yenile ki credits güncellensin
          }
          
          // Banner listesini backend'den yeniden çek
          loadBanners();
          setCreateDialogOpen(false);
          
          // Form'u temizle
          const defaultCategory = currentUser?.category || (currentUser?.userType === 'eventBrand' ? 'Çizim' : 'Kahve');
          setFormData({
            campaignDescription: '',
            targetAudience: 'Genel kitle',
            category: defaultCategory,
            codeQuota: 10,
            codeType: 'random',
            fixedCode: '',
            offerType: 'percentage',
            discountPercentage: 20,
            originalPrice: '',
            discountedPrice: '',
            freeItemName: '',
            freeItemCondition: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '23:00',
            location: {
              city: currentUser?.city || 'İstanbul',
              district: currentUser?.district || 'Genel',
              address: '',
              coordinates: { latitude: null, longitude: null }
            },
            brandInfo: {
              name: currentUser?.name || '',
              type: currentUser?.brandType || 'restaurant',
              description: currentUser?.description || ''
            },
            menu: {
              link: '',
              image: null
            }
          });
          
          setSnackbar({
            open: true,
            message: 'Banner oluşturuldu! Admin onayı bekliyor. Onaylandığında kullanıcılara görünür olacak.',
            severity: 'success'
          });
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

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/generate-verification-code`, {
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/verify-customer-code`, {
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
        // Mesajı kampanya tipine göre oluştur
        let message = `Kod başarıyla doğrulandı!\n\nMüşteri: ${result.data.customerPhone}`;
        
        const offerType = result.data.offerType || 'percentage';
        const billAmount = result.data.billAmount;
        
        if (offerType === 'percentage' && billAmount) {
          message += `\n\n💰 Hesap Bilgileri:\n`;
          message += `• Toplam: ${billAmount.originalAmount} TL\n`;
          message += `• Ödenecek: ${billAmount.discountedAmount} TL\n`;
          message += `• İndirim: ${billAmount.savedAmount} TL (${result.data.offerDetails?.discountPercentage}%)`;
        } else if (offerType === 'fixedPrice') {
          const original = result.data.offerDetails?.originalPrice || 0;
          const discounted = result.data.offerDetails?.discountedPrice || 0;
          message += `\n\n💰 Kampanya:\n`;
          message += `• Kampanyalı Fiyat: ${discounted} TL\n`;
          message += `• Normal Fiyat: ${original} TL\n`;
          message += `• Kazanç: ${original - discounted} TL`;
        } else if (offerType === 'freeItem') {
          message += `\n\n🎁 Kampanya:\n`;
          message += `• ${result.data.offerDetails?.freeItemCondition}\n`;
          message += `• ${result.data.offerDetails?.freeItemName} BEDAVA!`;
        }
        
        alert(message);
        
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/banners/${bannerId}?restaurantName=${encodeURIComponent(currentUser.name)}`, {
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Kredi Bilgisi */}
          <Card sx={{ minWidth: 150 }}>
            <CardContent sx={{ py: 1, px: 2 }}>
              <Typography color="textSecondary" variant="caption">
                Kalan Krediniz
              </Typography>
              <Typography variant="h5" color={currentUser?.credits > 0 ? 'success.main' : 'error.main'}>
                {currentUser?.credits ?? 0}
              </Typography>
            </CardContent>
          </Card>
          <Button
            variant="contained"
            startIcon={<Create />}
            onClick={handleOpenCreateDialog}
            disabled={!currentUser?.credits || currentUser.credits <= 0}
          >
            Banner Oluştur
          </Button>
        </Box>
      </Box>

      {/* Kredi Uyarısı */}
      {(!currentUser?.credits || currentUser.credits <= 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Krediniz yetersiz! Banner oluşturmak için kredinizi yenilemeniz gerekiyor.
        </Alert>
      )}

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
                    Henüz banner oluşturulmamış. İlk banner'ınızı oluşturmak için "Banner Oluştur" butonuna tıklayın.
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
                        icon={getStatusIcon(banner.approvalStatus || 'pending')}
                        label={getStatusText(banner.approvalStatus || 'pending')}
                        color={getStatusColor(banner.approvalStatus || 'pending')}
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
                        <IconButton 
                          size="small" 
                          title="Düzenle"
                          onClick={() => handleOpenEditDialog(banner)}
                        >
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
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={window.innerWidth < 600}
      >
        <DialogTitle>
          Yeni Bildirim Oluştur
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
                  label="Kampanya Başlığı"
                  placeholder="Örnek: Özel İndirim Fırsatı"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  sx={{ mb: 2 }}
                />
                
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
                
                {/* <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={formData.category}
                    label="Kategori"
                    disabled
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {currentUser?.userType === 'eventBrand' ? (
                      <>
                        <MenuItem value="Konser">🎵 Konser</MenuItem>
                        <MenuItem value="Sinema">🎬 Sinema</MenuItem>
                        <MenuItem value="Tiyatro">🎭 Tiyatro</MenuItem>
                        <MenuItem value="Sosyal Etkinlik">🎉 Sosyal Etkinlik</MenuItem>
                        <MenuItem value="Spor Etkinliği">🏃 Spor Etkinliği</MenuItem>
                        <MenuItem value="El Sanatları">🎨 El Sanatları</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="Kahve">Kahve</MenuItem>
                        <MenuItem value="Yiyecek">Yiyecek</MenuItem>
                        <MenuItem value="Bar/Pub">Bar/Pub</MenuItem>
                        <MenuItem value="Giyim">Giyim</MenuItem>
                        <MenuItem value="Kuaför">Kuaför</MenuItem>
                        <MenuItem value="Spor">Spor</MenuItem>
                        <MenuItem value="Tatlı">Tatlı</MenuItem>
                        <MenuItem value="Mobilya">Mobilya</MenuItem>
                        <MenuItem value="Çizim">🎨 Çizim</MenuItem>
                        <MenuItem value="Boyama">🖌️ Boyama</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl> */}
                <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block', mt: -1 }}>
                  Kategori, kayıt sırasında belirlediğiniz kategoriye sabitlenmiştir
                </Typography>

                <TextField
                  fullWidth
                  label="Kod Kotası (Toplam Kod Sayısı)"
                  type="number"
                  value={formData.codeQuota}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('Dashboard - Kod kotası değişti:', value);
                    handleInputChange('codeQuota', value);
                  }}
                  inputProps={{ min: 1, max: 1000 }}
                  helperText="Bu kampanya için kaç adet kod oluşturulabileceğini belirleyin"
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Kod Tipi</InputLabel>
                  <Select
                    value={formData.codeType}
                    label="Kod Tipi"
                    onChange={(e) => handleInputChange('codeType', e.target.value)}
                  >
                    <MenuItem value="random">Random Kod (Her kullanıcı için farklı)</MenuItem>
                    <MenuItem value="fixed">Sabit Kod (Tüm kullanıcılar için aynı)</MenuItem>
                  </Select>
                </FormControl>

                {formData.codeType === 'fixed' && (
                  <TextField
                    fullWidth
                    label="Sabit Kod"
                    type="text"
                    value={formData.fixedCode}
                    onChange={(e) => {
                      // Sadece harf ve rakam, boşluk ve özel karakter yok
                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
                      handleInputChange('fixedCode', value);
                    }}
                    inputProps={{ maxLength: 20 }}
                    placeholder="Örnek: indirim20, KAHVE50, yaz2025"
                    helperText="Tüm kullanıcılar bu kodu kullanacak. Harf ve rakam kullanabilirsiniz (4-20 karakter)."
                    sx={{ mb: 2 }}
                    error={formData.codeType === 'fixed' && (formData.fixedCode.length < 4 || formData.fixedCode.length > 20)}
                  />
                )}
                
                {/* Kampanya Tipi */}
                <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                  <InputLabel>Kampanya Tipi</InputLabel>
                  <Select
                    value={formData.offerType}
                    label="Kampanya Tipi"
                    onChange={(e) => handleInputChange('offerType', e.target.value)}
                  >
                    <MenuItem value="percentage">Yüzde İndirim</MenuItem>
                    <MenuItem value="fixedPrice">Sabit Fiyat</MenuItem>
                    <MenuItem value="freeItem">Bedava Ürün</MenuItem>
                  </Select>
                </FormControl>

                {/* Yüzde İndirim */}
                {formData.offerType === 'percentage' && (
                  <TextField
                    fullWidth
                    label="İndirim Yüzdesi"
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                    inputProps={{ min: 1, max: 100 }}
                    helperText="Örnek: 20 (müşteri hesabından %20 indirim yapılacak)"
                    sx={{ mb: 2 }}
                  />
                )}

                {/* Sabit Fiyat */}
                {formData.offerType === 'fixedPrice' && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Normal Fiyat (TL)"
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        inputProps={{ min: 0 }}
                        helperText="Ürünün normal fiyatı"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Kampanyalı Fiyat (TL)"
                        type="number"
                        value={formData.discountedPrice}
                        onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                        inputProps={{ min: 0 }}
                        helperText="Kampanyalı fiyat"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                )}

                {/* Bedava Ürün */}
                {formData.offerType === 'freeItem' && (
                  <>
                    <TextField
                      fullWidth
                      label="Koşul"
                      type="text"
                      value={formData.freeItemCondition}
                      onChange={(e) => handleInputChange('freeItemCondition', e.target.value)}
                      placeholder="Örnek: Kahve alana"
                      helperText="Koşul nedir?"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Bedava Ürün"
                      type="text"
                      value={formData.freeItemName}
                      onChange={(e) => handleInputChange('freeItemName', e.target.value)}
                      placeholder="Örnek: Cheesecake"
                      helperText="Hangi ürün bedava verilecek?"
                      sx={{ mb: 2 }}
                    />
                  </>
                )}
                
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

                {/* Kampanya Tarihleri */}
                <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>
                  📅 Kampanya Tarihleri
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Başlangıç Tarihi"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      helperText="Kampanyanın başlayacağı tarih"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bitiş Tarihi"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      helperText="Kampanyanın biteceği tarih"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Başlangıç Saati"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      helperText="Günlük başlangıç saati"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bitiş Saati"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      helperText="Günlük bitiş saati"
                    />
                  </Grid>
                </Grid>

                {/* Marka Bilgileri */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  🏪 Marka Bilgileri
                </Typography>
                
                <TextField
                  fullWidth
                  label="Marka Adı"
                  value={currentUser?.name || ''}
                  disabled
                  helperText="Bu alan otomatik olarak doldurulur ve değiştirilemez"
                  size="small"
                  sx={{ mb: 2 }}
                />

                {/* Banner Görseli */}
                <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    🖼️ Banner Görseli
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Kampanya görseli yükleyin (isteğe bağlı):
                  </Typography>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Dosyayı base64'e çevir (gerçek uygulamada S3'e yüklenir)
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handleInputChange('bannerImage', event.target.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ marginBottom: '16px' }}
                  />
                  
                  {formData.bannerImage && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="success.main">
                        ✅ Banner görseli yüklendi
                      </Typography>
                      <img 
                        src={formData.bannerImage} 
                        alt="Banner önizleme" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px', 
                          marginTop: '8px' 
                        }} 
                      />
                    </Box>
                  )}
                  
                  <Typography variant="caption" color="textSecondary">
                    Banner görseli kampanya detay sayfasında en üstte görüntülenecektir.
                  </Typography>
                </Box>
              </Grid>
              
              {/* <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Banner Tasarım Önizleme
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
              </Grid> */}
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
            disabled={loading || !formData.title.trim() || !formData.campaignDescription.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Create />}
          >
            {loading ? 'Oluşturuluyor...' : 'Banner Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Banner Düzenleme Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => {
          setEditDialogOpen(false);
          setEditingBanner(null);
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          ✏️ Banner Düzenle
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kampanya Başlığı"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  sx={{ mb: 2 }}
                />
                
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

                {/* Kod Ayarları */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Kod Tipi</InputLabel>
                  <Select
                    value={formData.codeType}
                    label="Kod Tipi"
                    onChange={(e) => handleInputChange('codeType', e.target.value)}
                  >
                    <MenuItem value="random">Random Kod (Her kullanıcı için farklı)</MenuItem>
                    <MenuItem value="fixed">Sabit Kod (Tüm kullanıcılar için aynı)</MenuItem>
                  </Select>
                </FormControl>

                {formData.codeType === 'fixed' && (
                  <TextField
                    fullWidth
                    label="Sabit Kod"
                    value={formData.fixedCode}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      handleInputChange('fixedCode', value);
                    }}
                    inputProps={{ maxLength: 20 }}
                    helperText="4-20 karakter, sadece harf ve rakam"
                    sx={{ mb: 2 }}
                  />
                )}

                <TextField
                  fullWidth
                  type="number"
                  label="Kod Kotası"
                  value={formData.codeQuota}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleInputChange('codeQuota', value);
                  }}
                  inputProps={{ min: 1, max: 1000 }}
                  sx={{ mb: 2 }}
                />

                {/* Kampanya Tipi */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Kampanya Tipi</InputLabel>
                  <Select
                    value={formData.offerType}
                    label="Kampanya Tipi"
                    onChange={(e) => handleInputChange('offerType', e.target.value)}
                  >
                    <MenuItem value="percentage">Yüzde İndirim</MenuItem>
                    <MenuItem value="fixedPrice">Sabit Fiyat</MenuItem>
                    <MenuItem value="freeItem">Bedava Ürün</MenuItem>
                  </Select>
                </FormControl>

                {/* Yüzde İndirim */}
                {formData.offerType === 'percentage' && (
                  <TextField
                    fullWidth
                    type="number"
                    label="İndirim Yüzdesi (%)"
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                    inputProps={{ min: 1, max: 100 }}
                    sx={{ mb: 2 }}
                  />
                )}

                {/* Sabit Fiyat */}
                {formData.offerType === 'fixedPrice' && (
                  <>
                    <TextField
                      fullWidth
                      type="number"
                      label="Orijinal Fiyat (₺)"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      inputProps={{ min: 0 }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="İndirimli Fiyat (₺)"
                      value={formData.discountedPrice}
                      onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                      inputProps={{ min: 0 }}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}

                {/* Bedava Ürün */}
                {formData.offerType === 'freeItem' && (
                  <>
                    <TextField
                      fullWidth
                      label="Bedava Ürün Adı"
                      value={formData.freeItemName}
                      onChange={(e) => handleInputChange('freeItemName', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Koşul (Örn: 2 pizza alana)"
                      value={formData.freeItemCondition}
                      onChange={(e) => handleInputChange('freeItemCondition', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}

                {/* Hedef Kitle */}
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

                {/* Kampanya Tarihleri */}
                <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>
                  📅 Kampanya Tarihleri
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Başlangıç Tarihi"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Bitiş Tarihi"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Başlangıç Saati"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      helperText="Günlük başlangıç saati"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Bitiş Saati"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      helperText="Günlük bitiş saati"
                    />
                  </Grid>
                </Grid>

                {/* Banner Görseli */}
                <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    🖼️ Banner Görseli
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Kampanya görseli yükleyin (isteğe bağlı):
                  </Typography>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handleInputChange('bannerImage', event.target.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ marginBottom: '16px' }}
                  />
                  
                  {formData.bannerImage && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="success.main">
                        ✅ Banner görseli yüklendi
                      </Typography>
                      <img 
                        src={formData.bannerImage} 
                        alt="Banner önizleme" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          marginTop: '8px'
                        }} 
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setEditingBanner(null);
          }}>
            İptal
          </Button>
          <Button
            onClick={handleUpdateBanner}
            variant="contained"
            disabled={loading || !formData.title.trim() || !formData.campaignDescription.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Edit />}
          >
            {loading ? 'Güncelleniyor...' : 'Banner Güncelle'}
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
                    Durum:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      icon={getStatusIcon(selectedBanner.approvalStatus || 'pending')}
                      label={getStatusText(selectedBanner.approvalStatus || 'pending')}
                      color={getStatusColor(selectedBanner.approvalStatus || 'pending')}
                    />
                  </Box>
                  
                  {selectedBanner.approvalStatus === 'rejected' && selectedBanner.rejectedReason && (
                    <Box sx={{ mb: 2 }}>
                      <Alert severity="error">
                        <Typography variant="subtitle2" fontWeight="bold">Red Sebebi:</Typography>
                        <Typography variant="body2">{selectedBanner.rejectedReason}</Typography>
                      </Alert>
                    </Box>
                  )}
                  
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