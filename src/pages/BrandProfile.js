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
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Save as SaveIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Storefront as StorefrontIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Checkbox, FormControlLabel } from '@mui/material';

function BrandProfile({ currentUser, setCurrentUser }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editing, setEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [menuPreview, setMenuPreview] = useState(null);
  const [menuPreviews, setMenuPreviews] = useState([]); // Çoklu menü görselleri
  const [menuType, setMenuType] = useState('image'); // 'image' veya 'link'
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [menuImage, setMenuImage] = useState(null);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    description: '',
    discountPercentage: '10',
    codeQuota: '100',
  });
  
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
    latitude: null,
    longitude: null,
    logo: null,
    bannerImage: null,
    menuImage: null,
    menuImages: [],
    menuLink: null,
    openingHours: {
      monday: { open: '09:00', close: '22:00', isOpen: true },
      tuesday: { open: '09:00', close: '22:00', isOpen: true },
      wednesday: { open: '09:00', close: '22:00', isOpen: true },
      thursday: { open: '09:00', close: '22:00', isOpen: true },
      friday: { open: '09:00', close: '22:00', isOpen: true },
      saturday: { open: '09:00', close: '22:00', isOpen: true },
      sunday: { open: '09:00', close: '22:00', isOpen: true }
    },
    features: {
      hasChildrenPlayground: false,
      hasNonSmokingArea: false,
      hasParking: false,
      hasWifi: false,
      hasDelivery: false,
      hasTakeaway: false,
      hasOutdoorSeating: false,
      hasWheelchairAccess: false,
      acceptsReservations: false,
      acceptsCreditCard: false,
      hasLiveMusic: false,
      hasPetFriendly: false,
      hasValetParking: false,
      hasPrivateRoom: false,
      hasKidsMenu: false,
      hasVegetarianOptions: false,
      hasVeganOptions: false,
      hasGlutenFreeOptions: false,
      hasHalalOptions: false,
      customFeatures: []
    }
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
    'Boyama',
    'Petrol Ofisi'
  ];

  const eventCategories = [
    'Konser',
    'Sinema',
    'Tiyatro',
    'Sosyal Etkinlik',
    'Spor Etkinliği',
    'El Sanatları'
  ];

  const categories = currentUser?.userType === 'eventBrand' ? eventCategories : campaignCategories;

  useEffect(() => {
    if (currentUser) {
      let defaultCategory = currentUser.category;
      if (!defaultCategory) {
        defaultCategory = currentUser.userType === 'eventBrand' ? 'Konser' : 'Kahve';
      }
      
      // Menü tipini belirle (link varsa link, image varsa image)
      const initialMenuType = currentUser?.menuLink ? 'link' : ((currentUser?.menuImages && currentUser.menuImages.length > 0) || currentUser?.menuImage ? 'image' : 'image');
      setMenuType(initialMenuType);
      
      // Banner görselini yükle
      if (currentUser?.bannerImage) {
        setBannerPreview(currentUser.bannerImage);
      } else {
        setBannerPreview(null);
      }
      
      // Menü görsellerini yükle
      const existingMenuImages = currentUser?.menuImages && currentUser.menuImages.length > 0 
        ? currentUser.menuImages 
        : (currentUser?.menuImage ? [currentUser.menuImage] : []);
      
      setMenuPreviews(existingMenuImages);
      
      // OpeningHours default değerleri
      const defaultOpeningHours = {
        monday: { open: '09:00', close: '22:00', isOpen: true },
        tuesday: { open: '09:00', close: '22:00', isOpen: true },
        wednesday: { open: '09:00', close: '22:00', isOpen: true },
        thursday: { open: '09:00', close: '22:00', isOpen: true },
        friday: { open: '09:00', close: '22:00', isOpen: true },
        saturday: { open: '09:00', close: '22:00', isOpen: true },
        sunday: { open: '09:00', close: '22:00', isOpen: true }
      };
      
      // Features default değerleri
      const defaultFeatures = {
        hasChildrenPlayground: false,
        hasNonSmokingArea: false,
        hasParking: false,
        hasWifi: false,
        hasDelivery: false,
        hasTakeaway: false,
        hasOutdoorSeating: false,
        hasWheelchairAccess: false,
        acceptsReservations: false,
        acceptsCreditCard: false,
        hasLiveMusic: false,
        hasPetFriendly: false,
        hasValetParking: false,
        hasPrivateRoom: false,
        hasKidsMenu: false,
        hasVegetarianOptions: false,
        hasVeganOptions: false,
        hasGlutenFreeOptions: false,
        hasHalalOptions: false,
        customFeatures: []
      };
      
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
        latitude: currentUser.latitude || null,
        longitude: currentUser.longitude || null,
        bannerImage: null, // Yeni yüklenecek banner için
        menuLink: currentUser.menuLink || null,
        menuImages: [], // Sadece yeni File objelerini tut, mevcut görseller backend'de korunacak
        openingHours: currentUser.openingHours ? { ...defaultOpeningHours, ...currentUser.openingHours } : defaultOpeningHours,
        features: currentUser.features ? { ...defaultFeatures, ...currentUser.features } : defaultFeatures,
      }));
    }
  }, [currentUser]);

  // Düzenleme moduna geçildiğinde mevcut görselleri yükle
  useEffect(() => {
    if (editing) {
      // localStorage'dan güncel veriyi yükle
      const storedUserData = localStorage.getItem('userData');
      let userToUse = currentUser;
      
      if (storedUserData) {
        try {
          const parsedUser = JSON.parse(storedUserData);
          userToUse = parsedUser;
          console.log('🔄 useEffect - localStorage\'dan yüklenen kullanıcı:', parsedUser);
          console.log('🔄 menuImages:', parsedUser.menuImages);
          console.log('🔄 menuImage:', parsedUser.menuImage);
          
          // currentUser prop'unu da güncelle
          if (setCurrentUser) {
            setCurrentUser(parsedUser);
          }
        } catch (e) {
          console.error('LocalStorage parse hatası:', e);
        }
      }
      
      if (userToUse) {
        const existingMenuImages = userToUse?.menuImages && Array.isArray(userToUse.menuImages) && userToUse.menuImages.length > 0 
          ? userToUse.menuImages 
          : (userToUse?.menuImage ? [userToUse.menuImage] : []);
        
        console.log('🔄 useEffect - Yüklenecek menü görselleri:', existingMenuImages);
        console.log('🔄 useEffect - menuPreviews önceki değer:', menuPreviews);
        
        // State'i güncelle
        if (existingMenuImages.length > 0) {
          setMenuPreviews(existingMenuImages);
          console.log('🔄 useEffect - menuPreviews güncellendi:', existingMenuImages);
        } else {
          console.log('🔄 useEffect - Görsel bulunamadı, menuPreviews temizleniyor');
          setMenuPreviews([]);
        }
      }
    }
  }, [editing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Logo dosyası 5MB\'dan küçük olmalıdır!',
          severity: 'error'
        });
        return;
      }

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

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Banner dosyası 5MB\'dan küçük olmalıdır!',
          severity: 'error'
        });
        return;
      }

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
        bannerImage: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Maksimum 20 görsel kontrolü
    const currentCount = menuPreviews.length;
    if (currentCount + files.length > 20) {
      setSnackbar({
        open: true,
        message: `Maksimum 20 menü görseli yükleyebilirsiniz! (Şu an ${currentCount} görsel var)`,
        severity: 'error'
      });
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} - 5MB'dan büyük`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} - Geçersiz dosya tipi`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setSnackbar({
        open: true,
        message: `Bazı dosyalar yüklenemedi:\n${invalidFiles.join('\n')}`,
        severity: 'warning'
      });
    }

    if (validFiles.length === 0) return;

    // Mevcut görselleri koru ve yeni görselleri ekle
    const newPreviews = [...menuPreviews];
    const newFiles = [...(formData.menuImages || [])];

    // Tüm dosyaları önce array'e ekle
    validFiles.forEach(file => {
      newFiles.push(file);
    });

    // Sonra preview'ları oluştur
    let loadedCount = 0;
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setMenuPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({
      ...prev,
      menuImages: newFiles,
      menuImage: newFiles[0] // İlk görseli eski uyumluluk için
    }));
  };

  const handleRemoveMenuImage = (index) => {
    const newPreviews = menuPreviews.filter((_, i) => i !== index);
    const newFiles = formData.menuImages.filter((_, i) => i !== index);
    
    setMenuPreviews(newPreviews);
    setFormData(prev => ({
      ...prev,
      menuImages: newFiles,
      menuImage: newFiles[0] || null
    }));
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
      
      if (formData.latitude !== null && formData.latitude !== undefined && formData.latitude !== '') {
        formDataToSend.append('latitude', String(formData.latitude));
      }
      if (formData.longitude !== null && formData.longitude !== undefined && formData.longitude !== '') {
        formDataToSend.append('longitude', String(formData.longitude));
      }
      
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      if (formData.bannerImage) {
        formDataToSend.append('bannerImage', formData.bannerImage);
      }

      // Menü görselleri yükleme (çoklu)
      // Sadece File objelerini gönder (string URL'leri değil)
      if (formData.menuImages && formData.menuImages.length > 0) {
        const fileObjects = formData.menuImages.filter(file => file instanceof File);
        if (fileObjects.length > 0) {
          fileObjects.forEach((file) => {
            formDataToSend.append('menuImages', file);
          });
        }
      } else if (formData.menuImage && formData.menuImage instanceof File) {
        // Eski uyumluluk için tek görsel desteği (sadece File objesi ise)
        formDataToSend.append('menuImage', formData.menuImage);
      }

      // menuLink her zaman gönderilmeli (boş string olsa bile null yapılması için)
      formDataToSend.append('menuLink', formData.menuLink || '');

      // Açılış-Kapanış Saatleri
      const openingHoursJson = JSON.stringify(formData.openingHours);
      formDataToSend.append('openingHours', openingHoursJson);
      console.log('📤 Opening Hours gönderiliyor:', openingHoursJson);
      
      // Restoran Özellikleri
      const featuresJson = JSON.stringify(formData.features);
      formDataToSend.append('features', featuresJson);
      console.log('📤 Features gönderiliyor:', featuresJson);
      console.log('📤 API URL:', `${API_CONFIG.BASE_URL}/api/auth/update-profile`);
      console.log('📤 FormData içeriği:', {
        hasLogo: !!formData.logo,
        menuImagesCount: formData.menuImages?.filter(f => f instanceof File).length || 0,
        hasMenuLink: !!formData.menuLink
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          // Content-Type header'ını ekleme - FormData kullanıldığında browser otomatik ekler
        },
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        // Backend'den gelen güncel veriyi kullan
        const updatedUser = result.user || { ...currentUser, ...result.data };
        
        // openingHours ve features'ı da güncelle
        if (result.user?.openingHours) {
          updatedUser.openingHours = result.user.openingHours;
        }
        if (result.user?.features) {
          updatedUser.features = result.user.features;
        }
        
        setSnackbar({
          open: true,
          message: 'Marka profili başarıyla güncellendi!',
          severity: 'success'
        });
        
        setEditing(false);
        setLogoPreview(null);
        setMenuPreviews([]); // Yeni görseller yüklendi, preview'ları temizle
        
        // Backend'den gelen güncel veriyi localStorage'a kaydet ve state'i güncelle
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        
        // FormData'yı da güncelle
        setFormData(prev => ({
          ...prev,
          menuImages: [], // Yeni görseller yüklendi, File objelerini temizle
          openingHours: updatedUser.openingHours || prev.openingHours,
          features: updatedUser.features || prev.features
        }));
        
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
      console.error('Hata detayları:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setSnackbar({
        open: true,
        message: error.message || 'Profil güncellenirken hata oluştu! Lütfen internet bağlantınızı kontrol edin.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setLogoPreview(null);
    setBannerPreview(null);
    setMenuPreview(null);
    
    // localStorage'dan güncel veriyi yükle
    const storedUserData = localStorage.getItem('userData');
    let userToUse = currentUser;
    
    if (storedUserData) {
      try {
        userToUse = JSON.parse(storedUserData);
      } catch (e) {
        console.error('LocalStorage parse hatası:', e);
      }
    }
    
    if (userToUse) {
      // Banner görselini yükle
      if (userToUse?.bannerImage) {
        setBannerPreview(userToUse.bannerImage);
      } else {
        setBannerPreview(null);
      }
      
      // Menü görsellerini yükle
      const existingMenuImages = userToUse?.menuImages && Array.isArray(userToUse.menuImages) && userToUse.menuImages.length > 0 
        ? userToUse.menuImages 
        : (userToUse?.menuImage ? [userToUse.menuImage] : []);
      setMenuPreviews(existingMenuImages);
      
      let defaultCategory = userToUse.category;
      if (!defaultCategory) {
        defaultCategory = userToUse.userType === 'eventBrand' ? 'Konser' : 'Kahve';
      }
      
      // OpeningHours default değerleri
      const defaultOpeningHours = {
        monday: { open: '09:00', close: '22:00', isOpen: true },
        tuesday: { open: '09:00', close: '22:00', isOpen: true },
        wednesday: { open: '09:00', close: '22:00', isOpen: true },
        thursday: { open: '09:00', close: '22:00', isOpen: true },
        friday: { open: '09:00', close: '22:00', isOpen: true },
        saturday: { open: '09:00', close: '22:00', isOpen: true },
        sunday: { open: '09:00', close: '22:00', isOpen: true }
      };
      
      // Features default değerleri
      const defaultFeatures = {
        hasChildrenPlayground: false,
        hasNonSmokingArea: false,
        hasParking: false,
        hasWifi: false,
        hasDelivery: false,
        hasTakeaway: false,
        hasOutdoorSeating: false,
        hasWheelchairAccess: false,
        acceptsReservations: false,
        acceptsCreditCard: false,
        hasLiveMusic: false,
        hasPetFriendly: false,
        hasValetParking: false,
        hasPrivateRoom: false,
        hasKidsMenu: false,
        hasVegetarianOptions: false,
        hasVeganOptions: false,
        hasGlutenFreeOptions: false,
        hasHalalOptions: false,
        customFeatures: []
      };
      
      setFormData({
        brandName: userToUse.name || '',
        brandType: userToUse.brandType || '',
        description: userToUse.description || '',
        category: defaultCategory,
        phone: userToUse.phone || '',
        email: userToUse.email || '',
        address: userToUse.address || '',
        city: userToUse.city || 'İstanbul',
        district: userToUse.district || 'Kadıköy',
        latitude: userToUse.latitude || null,
        longitude: userToUse.longitude || null,
        logo: null,
        bannerImage: null,
        menuImage: null,
        menuImages: [],
        menuLink: userToUse.menuLink || null,
        openingHours: userToUse.openingHours ? { ...defaultOpeningHours, ...userToUse.openingHours } : defaultOpeningHours,
        features: userToUse.features ? { ...defaultFeatures, ...userToUse.features } : defaultFeatures,
      });
      setMenuType(userToUse?.menuLink ? 'link' : ((userToUse?.menuImages && userToUse.menuImages.length > 0) || userToUse?.menuImage ? 'image' : 'image'));
    }
  };

  const handleMenuImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Menü görseli 5MB\'dan küçük olmalıdır!',
          severity: 'error'
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSimpleBanner = async () => {
    // Form validasyonu
    if (!bannerFormData.title.trim()) {
      setSnackbar({
        open: true,
        message: 'Banner başlığı gerekli!',
        severity: 'error'
      });
      return;
    }
    if (!bannerFormData.description.trim()) {
      setSnackbar({
        open: true,
        message: 'Banner açıklaması gerekli!',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Giriş yapmanız gerekiyor!',
          severity: 'error'
        });
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/banners/create-simple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
            title: bannerFormData.title,
            description: bannerFormData.description,
            discountPercentage: parseInt(bannerFormData.discountPercentage) || 10,
            codeQuota: parseInt(bannerFormData.codeQuota) || 100,
            bannerImage: bannerImage,
            menuImage: menuImage
          })
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Banner başarıyla oluşturuldu! Admin onayından sonra yayınlanacaktır.',
          severity: 'success'
        });
        setBannerDialogOpen(false);
        setBannerImage(null);
        setMenuImage(null);
        setBannerFormData({
          title: '',
          description: '',
          discountPercentage: '10',
          codeQuota: '100',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Banner oluşturulurken hata oluştu!',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Banner oluşturma hatası:', error);
      setSnackbar({
        open: true,
        message: 'Banner oluşturulurken hata oluştu!',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1024px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <StorefrontIcon sx={{ fontSize: 32, color: '#ef4444' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Marka Profili
            </Typography>
          </Box>
          
          {!editing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={async () => {
                // Düzenleme moduna geçerken localStorage'dan güncel veriyi yükle
                const storedUserData = localStorage.getItem('userData');
                let userToUse = currentUser;
                
                if (storedUserData) {
                  try {
                    const parsedUser = JSON.parse(storedUserData);
                    userToUse = parsedUser;
                    console.log('📥 Düzenleme modu - localStorage\'dan yüklenen kullanıcı:', parsedUser);
                    console.log('📥 Menü görselleri:', parsedUser.menuImages);
                    console.log('📥 Menü görseli (tek):', parsedUser.menuImage);
                    
                    // currentUser prop'unu da güncelle
                    if (setCurrentUser) {
                      setCurrentUser(parsedUser);
                    }
                  } catch (e) {
                    console.error('LocalStorage parse hatası:', e);
                  }
                }
                
                // Mevcut görselleri yükle
                const existingMenuImages = userToUse?.menuImages && Array.isArray(userToUse.menuImages) && userToUse.menuImages.length > 0 
                  ? userToUse.menuImages 
                  : (userToUse?.menuImage ? [userToUse.menuImage] : []);
                
                console.log('📥 Yüklenecek menü görselleri:', existingMenuImages);
                console.log('📥 menuPreviews önceki değer:', menuPreviews);
                
                // State'i güncelle
                setMenuPreviews(existingMenuImages);
                
                // Biraz bekle ve tekrar kontrol et (async state update için)
                setTimeout(() => {
                  console.log('📥 menuPreviews güncellenmiş değer:', menuPreviews);
                }, 100);
                
                setEditing(true);
              }}
              sx={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontWeight: 500,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#dc2626',
                },
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
                  borderColor: '#cbd5e1',
                  color: '#64748b',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    backgroundColor: '#fef2f2',
                  },
                }}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSaveProfile}
                disabled={loading}
                sx={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  },
                }}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Logo ve Temel Bilgiler */}
          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 4 }}>
                Logo ve Temel Bilgiler
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    width: 128,
                    height: 128,
                    mb: 3,
                    border: 'none',
                    backgroundColor: '#e2e8f0',
                    objectFit: 'cover',
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 64, color: '#94a3b8' }} />
                </Avatar>
                
                {editing && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 384 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="logo-upload"
                      type="file"
                      onChange={handleLogoUpload}
                    />
                    <label htmlFor="logo-upload" style={{ width: '100%' }}>
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        startIcon={<UploadIcon />}
                        sx={{
                          borderColor: '#e2e8f0',
                          color: '#64748b',
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                          },
                        }}
                      >
                        Logo Yükle
                      </Button>
                    </label>
                    <Typography variant="caption" sx={{ color: '#64748b', mt: 1 }}>
                      Maksimum 5MB, JPG/PNG
                    </Typography>
                  </Box>
                )}

                {/* Banner Görseli */}
                {editing && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 384, mt: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 2 }}>
                      Banner Görseli (Opsiyonel)
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        border: '2px dashed #cbd5e1',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8fafc',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                        },
                      }}
                    >
                      {bannerPreview || currentUser?.bannerImage ? (
                        <>
                          <img
                            src={bannerPreview || currentUser.bannerImage}
                            alt="Banner preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                            }}
                            onClick={() => {
                              setBannerPreview(null);
                              setFormData(prev => ({ ...prev, bannerImage: null }));
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                        <Box sx={{ textAlign: 'center' }}>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="banner-image-upload"
                            type="file"
                            onChange={handleBannerImageUpload}
                          />
                          <label htmlFor="banner-image-upload">
                            <ImageIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1, cursor: 'pointer' }} />
                            <Typography variant="body2" sx={{ color: '#64748b', cursor: 'pointer' }}>
                              Banner Görseli Seç
                            </Typography>
                          </label>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', mt: 1 }}>
                      Maksimum 5MB, JPG/PNG
                    </Typography>
                  </Box>
                )}

                {/* Marka Menüsü */}
                {editing && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 384, mt: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 2 }}>
                      Marka Menüsü (Opsiyonel)
                    </Typography>
                    
                    {/* Menü Tipi Seçimi */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Menü Tipi</InputLabel>
                      <Select
                        value={menuType}
                        label="Menü Tipi"
                        onChange={(e) => {
                          setMenuType(e.target.value);
                          if (e.target.value === 'link') {
                            setMenuPreview(null);
                            setMenuPreviews([]);
                            setFormData(prev => ({ ...prev, menuImage: null, menuImages: [] }));
                          } else {
                            setFormData(prev => ({ ...prev, menuLink: null }));
                          }
                        }}
                      >
                        <MenuItem value="image">Menü Fotoğrafı Yükle</MenuItem>
                        <MenuItem value="link">QR Menü Linki Ekle</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Menü Görseli Yükleme */}
                    {menuType === 'image' && (
                      <>
                        {/* Menü Görselleri Galerisi */}
                        {(() => {
                          // localStorage'dan güncel veriyi kontrol et
                          const storedUserData = localStorage.getItem('userData');
                          let userToUse = currentUser;
                          
                          if (storedUserData) {
                            try {
                              const parsedUser = JSON.parse(storedUserData);
                              userToUse = parsedUser;
                            } catch (e) {
                              console.error('LocalStorage parse hatası:', e);
                            }
                          }
                          
                          // menuImages array'ini kullan, yoksa menuPreviews'ı kullan (yeni yüklenen görseller için)
                          const allMenuImages = userToUse?.menuImages && Array.isArray(userToUse.menuImages) && userToUse.menuImages.length > 0
                            ? userToUse.menuImages
                            : [];
                          
                          // Yeni yüklenen görselleri de ekle (preview'lar)
                          const combinedImages = [...allMenuImages];
                          menuPreviews.forEach((preview) => {
                            // Eğer preview bir File objesi ise (yeni yüklenen), preview URL'ini kullan
                            // Eğer preview bir string ise ve allMenuImages'da yoksa ekle
                            if (typeof preview === 'string') {
                              if (!combinedImages.includes(preview)) {
                                combinedImages.push(preview);
                              }
                            } else if (preview instanceof File || (typeof preview === 'object' && preview !== null)) {
                              // File objesi için preview URL'ini kullan (menuPreviews'da zaten base64 veya blob URL var)
                              const previewUrl = typeof preview === 'string' ? preview : URL.createObjectURL(preview);
                              if (!combinedImages.includes(previewUrl)) {
                                combinedImages.push(previewUrl);
                              }
                            }
                          });
                          
                          const totalImages = combinedImages.length;
                          
                          if (totalImages > 0) {
                            return (
                              <Box sx={{ width: '100%', mb: 2 }}>
                                <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                                  {totalImages} / 20 görsel yüklendi
                                </Typography>
                                <Grid container spacing={2}>
                                  {combinedImages.map((imageUrl, index) => {
                                    // imageUrl string ise direkt kullan, File objesi ise blob URL kullan
                                    const imageSrc = typeof imageUrl === 'string' 
                                      ? (imageUrl.startsWith('http') || imageUrl.startsWith('blob:') || imageUrl.startsWith('data:'))
                                        ? imageUrl 
                                        : `${API_CONFIG.BASE_URL}/uploads/menus/${imageUrl}`
                                      : URL.createObjectURL(imageUrl);
                                    
                                    return (
                                      <Grid item xs={6} sm={4} key={index}>
                                        <Box sx={{ position: 'relative' }}>
                                          <img
                                            src={imageSrc}
                                            alt={`Menu ${index + 1}`}
                                            style={{
                                              width: '100%',
                                              height: '150px',
                                              objectFit: 'cover',
                                              borderRadius: '8px',
                                              border: '1px solid #e2e8f0'
                                            }}
                                          />
                                          <IconButton
                                            sx={{
                                              position: 'absolute',
                                              top: 4,
                                              right: 4,
                                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                              '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                              },
                                              width: 32,
                                              height: 32,
                                            }}
                                            onClick={() => handleRemoveMenuImage(index)}
                                          >
                                            <CloseIcon sx={{ fontSize: 18 }} />
                                          </IconButton>
                                        </Box>
                                      </Grid>
                                    );
                                  })}
                                </Grid>
                                <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>
                                  {totalImages} / 20 görsel yüklendi
                                </Typography>
                              </Box>
                            );
                          }
                          return null;
                        })()}
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="menu-upload"
                          type="file"
                          multiple
                          onChange={handleMenuUpload}
                        />
                        <label htmlFor="menu-upload" style={{ width: '100%' }}>
                          <Button
                            variant="outlined"
                            component="span"
                            fullWidth
                            startIcon={<UploadIcon />}
                            disabled={(() => {
                              const storedUserData = localStorage.getItem('userData');
                              let userToUse = currentUser;
                              if (storedUserData) {
                                try {
                                  userToUse = JSON.parse(storedUserData);
                                } catch (e) {}
                              }
                              const totalCount = (userToUse?.menuImages?.length || 0) + menuPreviews.length;
                              return totalCount >= 20;
                            })()}
                            sx={{
                              borderColor: '#e2e8f0',
                              color: '#64748b',
                              textTransform: 'none',
                              fontWeight: 500,
                              '&:hover': {
                                borderColor: '#ef4444',
                                color: '#ef4444',
                                backgroundColor: '#fef2f2',
                              },
                              '&:disabled': {
                                borderColor: '#cbd5e1',
                                color: '#94a3b8',
                              },
                            }}
                          >
                            {(() => {
                              const storedUserData = localStorage.getItem('userData');
                              let userToUse = currentUser;
                              if (storedUserData) {
                                try {
                                  userToUse = JSON.parse(storedUserData);
                                } catch (e) {}
                              }
                              const totalCount = (userToUse?.menuImages?.length || 0) + menuPreviews.length;
                              if (totalCount >= 20) {
                                return 'Maksimum 20 görsel yüklendi';
                              } else if (totalCount > 0) {
                                return 'Daha Fazla Görsel Ekle';
                              } else {
                                return 'Menü Fotoğrafları Yükle (Maks. 20)';
                              }
                            })()}
                          </Button>
                        </label>
                        <Typography variant="caption" sx={{ color: '#64748b', mt: 1 }}>
                          Maksimum 20 görsel, her biri 5MB'dan küçük, JPG/PNG. Bu menüler tüm banner'larınızda otomatik olarak gösterilecektir.
                        </Typography>
                      </>
                    )}

                    {/* Menü Linki */}
                    {menuType === 'link' && (
                      <>
                        <TextField
                          fullWidth
                          label="QR Menü Linki"
                          placeholder="https://example.com/menu veya QR menü linki"
                          value={formData.menuLink || currentUser?.menuLink || ''}
                          onChange={(e) => handleInputChange('menuLink', e.target.value)}
                          sx={{ mb: 2 }}
                          helperText="QR menü linkinizi buraya yapıştırın"
                        />
                        {formData.menuLink || currentUser?.menuLink ? (
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<CloseIcon />}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, menuLink: null }));
                            }}
                            sx={{
                              borderColor: '#e2e8f0',
                              color: '#64748b',
                              textTransform: 'none',
                              fontWeight: 500,
                              '&:hover': {
                                borderColor: '#ef4444',
                                color: '#ef4444',
                                backgroundColor: '#fef2f2',
                              },
                            }}
                          >
                            Menü Linkini Kaldır
                          </Button>
                        ) : null}
                      </>
                    )}
                  </Box>
                )}

                {/* Menü Görüntüleme (Düzenleme modu dışında) */}
                {!editing && (
                  (currentUser?.menuImages && Array.isArray(currentUser.menuImages) && currentUser.menuImages.length > 0) ||
                  currentUser?.menuImage ||
                  currentUser?.menuLink
                ) && (
                  <Box sx={{ width: '100%', mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={() => setMenuDialogOpen(true)}
                      sx={{
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: '#dc2626',
                          backgroundColor: '#fef2f2',
                        },
                      }}
                    >
                      Marka Menüsü
                      {currentUser?.menuImages && Array.isArray(currentUser.menuImages) && currentUser.menuImages.length > 0 && (
                        <Typography component="span" sx={{ ml: 1, color: '#64748b', fontSize: '0.875rem' }}>
                          ({currentUser.menuImages.length} görsel)
                        </Typography>
                      )}
                    </Button>
                  </Box>
                )}

                {/* Menü Görselleri Galeri Dialog */}
                <Dialog
                  open={menuDialogOpen}
                  onClose={() => {
                    setMenuDialogOpen(false);
                    setCurrentImageIndex(0);
                  }}
                  maxWidth="lg"
                  fullWidth
                  PaperProps={{
                    sx: {
                      backgroundColor: '#000',
                      maxHeight: '90vh',
                    }
                  }}
                >
                  {(() => {
                    // localStorage'dan güncel veriyi kontrol et
                    const storedUserData = localStorage.getItem('userData');
                    let userToUse = currentUser;
                    
                    console.log('🔍 Dialog - currentUser prop:', currentUser);
                    console.log('🔍 Dialog - currentUser.menuImages:', currentUser?.menuImages);
                    
                    if (storedUserData) {
                      try {
                        const parsedUser = JSON.parse(storedUserData);
                        userToUse = parsedUser;
                        console.log('🔍 Dialog - localStorage\'dan yüklenen kullanıcı:', parsedUser);
                        console.log('🔍 Dialog - localStorage menuImages:', parsedUser.menuImages);
                      } catch (e) {
                        console.error('LocalStorage parse hatası:', e);
                      }
                    }
                    
                    // menuImages array'ini kullan, yoksa menuImage'ı array'e çevir
                    let menuImages = [];
                    
                    if (userToUse?.menuImages && Array.isArray(userToUse.menuImages) && userToUse.menuImages.length > 0) {
                      menuImages = userToUse.menuImages;
                    } else if (userToUse?.menuImage) {
                      // Eğer menuImages array'i yoksa ama menuImage varsa, onu array'e çevir
                      menuImages = [userToUse.menuImage];
                    }
                    
                    console.log('🔍 Dialog - Kullanılacak menuImages:', menuImages);
                    console.log('🔍 Dialog - menuImages uzunluğu:', menuImages.length);
                    console.log('🔍 Dialog - userToUse.menuImage:', userToUse?.menuImage);
                    console.log('🔍 Dialog - userToUse.menuImages:', userToUse?.menuImages);
                    
                    if (menuImages.length === 0) {
                      return (
                        <>
                          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              Marka Menüsü
                            </Typography>
                            <IconButton onClick={() => {
                              setMenuDialogOpen(false);
                              setCurrentImageIndex(0);
                            }} sx={{ color: '#fff' }}>
                              <CloseIcon />
                            </IconButton>
                          </DialogTitle>
                          <DialogContent sx={{ backgroundColor: '#000', textAlign: 'center', py: 4 }}>
                            <Typography sx={{ color: '#fff' }}>
                              Henüz menü görseli eklenmemiş.
                            </Typography>
                          </DialogContent>
                        </>
                      );
                    }
                    
                    const currentImage = menuImages[currentImageIndex];
                    const hasNext = currentImageIndex < menuImages.length - 1;
                    const hasPrev = currentImageIndex > 0;
                    
                    const handleNext = () => {
                      if (hasNext) {
                        setCurrentImageIndex(prev => prev + 1);
                      }
                    };
                    
                    const handlePrev = () => {
                      if (hasPrev) {
                        setCurrentImageIndex(prev => prev - 1);
                      }
                    };
                    
                    return (
                      <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Marka Menüsü ({currentImageIndex + 1} / {menuImages.length})
                          </Typography>
                          <IconButton onClick={() => {
                            setMenuDialogOpen(false);
                            setCurrentImageIndex(0);
                          }} sx={{ color: '#fff' }}>
                            <CloseIcon />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ backgroundColor: '#000', p: 0, position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {/* Önceki Buton */}
                          {hasPrev && (
                            <IconButton
                              onClick={handlePrev}
                              sx={{
                                position: 'absolute',
                                left: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: '#fff',
                                zIndex: 2,
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                },
                              }}
                            >
                              <ChevronLeftIcon sx={{ fontSize: 40 }} />
                            </IconButton>
                          )}
                          
                          {/* Ana Görsel */}
                          <Box
                            sx={{
                              width: '100%',
                              height: '70vh',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                            onClick={() => window.open(currentImage.startsWith('http') ? currentImage : `${API_CONFIG.BASE_URL}/uploads/menus/${currentImage}`, '_blank')}
                          >
                            <img
                              src={currentImage.startsWith('http') ? currentImage : `${API_CONFIG.BASE_URL}/uploads/menus/${currentImage}`}
                              alt={`Menu ${currentImageIndex + 1}`}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </Box>
                          
                          {/* Sonraki Buton */}
                          {hasNext && (
                            <IconButton
                              onClick={handleNext}
                              sx={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: '#fff',
                                zIndex: 2,
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                },
                              }}
                            >
                              <ChevronRightIcon sx={{ fontSize: 40 }} />
                            </IconButton>
                          )}
                          
                          {/* Küçük Görseller (Thumbnails) */}
                          {menuImages.length > 1 && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                p: 2,
                                overflowX: 'auto',
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'center',
                              }}
                            >
                              {menuImages.map((imageUrl, index) => (
                                <Box
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    border: currentImageIndex === index ? '3px solid #ef4444' : '2px solid transparent',
                                    cursor: 'pointer',
                                    opacity: currentImageIndex === index ? 1 : 0.6,
                                    '&:hover': {
                                      opacity: 1,
                                      borderColor: '#ef4444',
                                    },
                                  }}
                                >
                                  <img
                                    src={imageUrl.startsWith('http') ? imageUrl : `${API_CONFIG.BASE_URL}/uploads/menus/${imageUrl}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                  />
                                </Box>
                              ))}
                            </Box>
                          )}
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: '#000', borderTop: '1px solid rgba(255,255,255,0.1)', p: 2, justifyContent: 'space-between' }}>
                          <Button
                            onClick={() => {
                              setMenuDialogOpen(false);
                              setCurrentImageIndex(0);
                            }}
                            sx={{ textTransform: 'none', color: '#fff' }}
                          >
                            Kapat
                          </Button>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              onClick={handlePrev}
                              disabled={!hasPrev}
                              startIcon={<ChevronLeftIcon />}
                              sx={{ textTransform: 'none', color: '#fff', '&:disabled': { color: '#666' } }}
                            >
                              Önceki
                            </Button>
                            <Button
                              onClick={handleNext}
                              disabled={!hasNext}
                              endIcon={<ChevronRightIcon />}
                              sx={{ textTransform: 'none', color: '#fff', '&:disabled': { color: '#666' } }}
                            >
                              Sonraki
                            </Button>
                          </Box>
                        </DialogActions>
                      </>
                    );
                  })()}
                </Dialog>

                <Box sx={{ width: '100%', maxWidth: 384, mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Marka Adı */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                      Marka Adı
                    </Typography>
                    <TextField
                      fullWidth
                      value={formData.brandName}
                      disabled={true}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f1f5f9',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f1f5f9',
                          },
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#1e293b',
                        },
                      }}
                    />
                    <Alert
                      severity="info"
                      icon={<InfoIcon />}
                      sx={{
                        mt: 2,
                        backgroundColor: '#eff6ff',
                        color: '#1e40af',
                        border: '1px solid #bfdbfe',
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          color: '#3b82f6',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        Marka adı kayıt sırasında seçilmiştir ve değiştirilemez.
                      </Typography>
                    </Alert>
                  </Box>

                  {/* Kategori */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                      Kategori
                    </Typography>
                    <TextField
                      fullWidth
                      value={formData.category || (currentUser?.userType === 'eventBrand' ? 'Konser' : 'Kahve')}
                      disabled={true}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f1f5f9',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f1f5f9',
                          },
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#1e293b',
                        },
                      }}
                    />
                    <Alert
                      severity="warning"
                      icon={<WarningIcon />}
                      sx={{
                        mt: 2,
                        backgroundColor: '#fffbeb',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          color: '#f59e0b',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        Kategori kayıt sırasında seçilmiştir ve değiştirilemez.
                      </Typography>
                    </Alert>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Sabit Banner Oluştur */}
          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <StorefrontIcon sx={{ fontSize: 48, color: '#ef4444', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Sabit Banner Oluştur
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3, maxWidth: 500, mx: 'auto' }}>
                Markanız için sabit bir kampanya banner'ı oluşturun. Admin onayından sonra yayınlanacaktır.
              </Typography>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setBannerDialogOpen(true)}
                disabled={loading}
                sx={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: 500,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  },
                  '&:disabled': {
                    backgroundColor: '#cbd5e1',
                  },
                }}
              >
                Banner Oluştur
              </Button>
            </CardContent>
          </Card>

          {/* Banner Oluşturma Dialog */}
          <Dialog
            open={bannerDialogOpen}
            onClose={() => {
              setBannerDialogOpen(false);
              setBannerImage(null);
              setBannerFormData({
                title: '',
                description: '',
                discountPercentage: '10',
                codeQuota: '100',
              });
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Yeni Banner Oluştur
              </Typography>
              <IconButton
                onClick={() => {
                  setBannerDialogOpen(false);
                  setBannerImage(null);
                  setBannerFormData({
                    title: '',
                    description: '',
                    discountPercentage: '10',
                    codeQuota: '100',
                  });
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                {/* Banner Görseli */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Banner Görseli (Opsiyonel)
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      border: '2px dashed #cbd5e1',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f8fafc',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                      },
                    }}
                  >
                    {bannerImage ? (
                      <>
                        <img
                          src={bannerImage}
                          alt="Banner preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            },
                          }}
                          onClick={() => setBannerImage(null)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="banner-image-upload"
                          type="file"
                          onChange={handleBannerImageUpload}
                        />
                        <label htmlFor="banner-image-upload">
                          <ImageIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1, cursor: 'pointer' }} />
                          <Typography variant="body2" sx={{ color: '#64748b', cursor: 'pointer' }}>
                            Görsel Seç
                          </Typography>
                        </label>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Menü Görseli */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Marka Menüsü (Opsiyonel)
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      border: '2px dashed #cbd5e1',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f8fafc',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                      },
                    }}
                  >
                    {menuImage ? (
                      <>
                        <img
                          src={menuImage}
                          alt="Menu preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            },
                          }}
                          onClick={() => setMenuImage(null)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="menu-image-upload"
                          type="file"
                          onChange={handleMenuImageUpload}
                        />
                        <label htmlFor="menu-image-upload">
                          <ImageIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1, cursor: 'pointer' }} />
                          <Typography variant="body2" sx={{ color: '#64748b', cursor: 'pointer' }}>
                            Menü Görseli Seç
                          </Typography>
                        </label>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Banner Başlığı */}
                <TextField
                  fullWidth
                  label="Banner Başlığı *"
                  value={bannerFormData.title}
                  onChange={(e) => setBannerFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Örn: Özel İndirim Kampanyası"
                  required
                />

                {/* Banner Açıklaması */}
                <TextField
                  fullWidth
                  label="Banner Açıklaması *"
                  value={bannerFormData.description}
                  onChange={(e) => setBannerFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Kampanya detaylarını buraya yazın..."
                  multiline
                  rows={4}
                  required
                />

                {/* İndirim Yüzdesi ve Kod Kotası */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="İndirim Yüzdesi (%)"
                      value={bannerFormData.discountPercentage}
                      onChange={(e) => setBannerFormData(prev => ({ ...prev, discountPercentage: e.target.value }))}
                      type="number"
                      placeholder="10"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Kod Kotası"
                      value={bannerFormData.codeQuota}
                      onChange={(e) => setBannerFormData(prev => ({ ...prev, codeQuota: e.target.value }))}
                      type="number"
                      placeholder="100"
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setBannerDialogOpen(false);
                  setBannerImage(null);
                  setBannerFormData({
                    title: '',
                    description: '',
                    discountPercentage: '10',
                    codeQuota: '100',
                  });
                }}
                disabled={loading}
                sx={{ textTransform: 'none' }}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateSimpleBanner}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                sx={{
                  backgroundColor: '#ef4444',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  },
                }}
              >
                {loading ? 'Oluşturuluyor...' : 'Oluştur'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Detaylı Bilgiler */}
          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 4 }}>
                Detaylı Bilgiler
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Açıklama */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                    Marka Açıklaması
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!editing}
                    placeholder="Marka Açıklaması"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: editing ? 'white' : '#f8fafc',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&:hover fieldset': {
                          borderColor: editing ? '#ef4444' : '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ef4444',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>

                {/* İletişim Bilgileri */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                      İletişim Bilgileri - Telefon
                    </Typography>
                    <TextField
                      fullWidth
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editing}
                      placeholder="Telefon"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: editing ? 'white' : '#f8fafc',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&:hover fieldset': {
                            borderColor: editing ? '#ef4444' : '#cbd5e1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ef4444',
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                      E-posta
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editing}
                      placeholder="E-posta"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: editing ? 'white' : '#f8fafc',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&:hover fieldset': {
                            borderColor: editing ? '#ef4444' : '#cbd5e1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ef4444',
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Adres Bilgileri */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                    Adres Bilgileri
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!editing}
                    placeholder="Adres"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: editing ? 'white' : '#f8fafc',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&:hover fieldset': {
                          borderColor: editing ? '#ef4444' : '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ef4444',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                        İlçe
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        disabled={!editing}
                        placeholder="İlçe"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: editing ? 'white' : '#f8fafc',
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: '#cbd5e1',
                            },
                            '&:hover fieldset': {
                              borderColor: editing ? '#ef4444' : '#cbd5e1',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ef4444',
                              borderWidth: 2,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                        Şehir
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!editing}
                        placeholder="Şehir"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: editing ? 'white' : '#f8fafc',
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: '#cbd5e1',
                            },
                            '&:hover fieldset': {
                              borderColor: editing ? '#ef4444' : '#cbd5e1',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ef4444',
                              borderWidth: 2,
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Konum Koordinatları */}
          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationIcon sx={{ color: '#ef4444', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Konum Koordinatları
                </Typography>
              </Box>
              
              <Alert
                severity="info"
                icon={<InfoIcon />}
                sx={{
                  mb: 3,
                  backgroundColor: '#ecfeff',
                  color: '#0e7490',
                  border: '1px solid #a5f3fc',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#06b6d4',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Bu koordinatlar tüm kampanyalarınız için kullanılacaktır. Google Maps'ten konumunuzu bulup koordinatları kopyalayabilirsiniz.
                </Typography>
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                    Enlem (Latitude)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formData.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                    disabled={!editing}
                    placeholder="Örnek: 41.0082"
                    inputProps={{ step: 'any' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: editing ? 'white' : '#f8fafc',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&:hover fieldset': {
                          borderColor: editing ? '#ef4444' : '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ef4444',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    Örnek: 41.0082
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                    Boylam (Longitude)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formData.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                    disabled={!editing}
                    placeholder="Örnek: 28.9784"
                    inputProps={{ step: 'any' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: editing ? 'white' : '#f8fafc',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&:hover fieldset': {
                          borderColor: editing ? '#ef4444' : '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ef4444',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    Örnek: 28.9784
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Açılış-Kapanış Saatleri */}
          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccessTimeIcon sx={{ color: '#ef4444', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Açılış-Kapanış Saatleri
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const dayNames = {
                    monday: 'Pazartesi',
                    tuesday: 'Salı',
                    wednesday: 'Çarşamba',
                    thursday: 'Perşembe',
                    friday: 'Cuma',
                    saturday: 'Cumartesi',
                    sunday: 'Pazar'
                  };
                  
                  // Güvenli erişim için openingHours kontrolü
                  const openingHours = formData.openingHours || {
                    monday: { open: '09:00', close: '22:00', isOpen: true },
                    tuesday: { open: '09:00', close: '22:00', isOpen: true },
                    wednesday: { open: '09:00', close: '22:00', isOpen: true },
                    thursday: { open: '09:00', close: '22:00', isOpen: true },
                    friday: { open: '09:00', close: '22:00', isOpen: true },
                    saturday: { open: '09:00', close: '22:00', isOpen: true },
                    sunday: { open: '09:00', close: '22:00', isOpen: true }
                  };
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={day}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Checkbox
                          checked={openingHours[day]?.isOpen || false}
                          onChange={(e) => {
                            setFormData(prev => {
                              const currentOpeningHours = prev.openingHours || {
                                monday: { open: '09:00', close: '22:00', isOpen: true },
                                tuesday: { open: '09:00', close: '22:00', isOpen: true },
                                wednesday: { open: '09:00', close: '22:00', isOpen: true },
                                thursday: { open: '09:00', close: '22:00', isOpen: true },
                                friday: { open: '09:00', close: '22:00', isOpen: true },
                                saturday: { open: '09:00', close: '22:00', isOpen: true },
                                sunday: { open: '09:00', close: '22:00', isOpen: true }
                              };
                              
                              return {
                              ...prev,
                              openingHours: {
                                  ...currentOpeningHours,
                                [day]: {
                                    ...(currentOpeningHours[day] || { open: '09:00', close: '22:00', isOpen: true }),
                                  isOpen: e.target.checked
                                }
                              }
                              };
                            });
                          }}
                          disabled={!editing}
                          sx={{ color: '#ef4444', '&.Mui-checked': { color: '#ef4444' } }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 100, fontWeight: 500 }}>
                          {dayNames[day]}
                        </Typography>
                      </Box>
                      {openingHours[day]?.isOpen && (
                        <Box sx={{ display: 'flex', gap: 1, ml: 5 }}>
                          <TextField
                            type="time"
                            size="small"
                            value={openingHours[day]?.open || '09:00'}
                            onChange={(e) => {
                              setFormData(prev => {
                                const currentOpeningHours = prev.openingHours || {
                                  monday: { open: '09:00', close: '22:00', isOpen: true },
                                  tuesday: { open: '09:00', close: '22:00', isOpen: true },
                                  wednesday: { open: '09:00', close: '22:00', isOpen: true },
                                  thursday: { open: '09:00', close: '22:00', isOpen: true },
                                  friday: { open: '09:00', close: '22:00', isOpen: true },
                                  saturday: { open: '09:00', close: '22:00', isOpen: true },
                                  sunday: { open: '09:00', close: '22:00', isOpen: true }
                                };
                                
                                return {
                                ...prev,
                                openingHours: {
                                    ...currentOpeningHours,
                                  [day]: {
                                      ...(currentOpeningHours[day] || { open: '09:00', close: '22:00', isOpen: true }),
                                    open: e.target.value
                                  }
                                }
                                };
                              });
                            }}
                            disabled={!editing}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            type="time"
                            size="small"
                            value={openingHours[day]?.close || '22:00'}
                            onChange={(e) => {
                              setFormData(prev => {
                                const currentOpeningHours = prev.openingHours || {
                                  monday: { open: '09:00', close: '22:00', isOpen: true },
                                  tuesday: { open: '09:00', close: '22:00', isOpen: true },
                                  wednesday: { open: '09:00', close: '22:00', isOpen: true },
                                  thursday: { open: '09:00', close: '22:00', isOpen: true },
                                  friday: { open: '09:00', close: '22:00', isOpen: true },
                                  saturday: { open: '09:00', close: '22:00', isOpen: true },
                                  sunday: { open: '09:00', close: '22:00', isOpen: true }
                                };
                                
                                return {
                                ...prev,
                                openingHours: {
                                    ...currentOpeningHours,
                                  [day]: {
                                      ...(currentOpeningHours[day] || { open: '09:00', close: '22:00', isOpen: true }),
                                    close: e.target.value
                                  }
                                }
                                };
                              });
                            }}
                            disabled={!editing}
                            sx={{ flex: 1 }}
                          />
                        </Box>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>

          {/* Restoran Özellikleri */}
          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StarIcon sx={{ color: '#ef4444', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Restoran Özellikleri
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {[
                  { key: 'hasChildrenPlayground', label: 'Çocuk Parkı' },
                  { key: 'hasNonSmokingArea', label: 'Sigara İçilmez Alan' },
                  { key: 'hasParking', label: 'Otopark' },
                  { key: 'hasWifi', label: 'WiFi' },
                  { key: 'hasDelivery', label: 'Teslimat' },
                  { key: 'hasTakeaway', label: 'Paket Servis' },
                  { key: 'hasOutdoorSeating', label: 'Açık Hava Oturma' },
                  { key: 'hasWheelchairAccess', label: 'Tekerlekli Sandalye Erişimi' },
                  { key: 'acceptsReservations', label: 'Rezervasyon Kabul Edilir' },
                  { key: 'acceptsCreditCard', label: 'Kredi Kartı Kabul Edilir' },
                  { key: 'hasLiveMusic', label: 'Canlı Müzik' },
                  { key: 'hasPetFriendly', label: 'Evcil Hayvan Dostu' },
                  { key: 'hasValetParking', label: 'Vale Otopark' },
                  { key: 'hasPrivateRoom', label: 'Özel Oda' },
                  { key: 'hasKidsMenu', label: 'Çocuk Menüsü' },
                  { key: 'hasVegetarianOptions', label: 'Vejetaryen Seçenekler' },
                  { key: 'hasVeganOptions', label: 'Vegan Seçenekler' },
                  { key: 'hasGlutenFreeOptions', label: 'Glutensiz Seçenekler' },
                  { key: 'hasHalalOptions', label: 'Helal Seçenekler' },
                ].map((feature) => (
                  <Grid item xs={12} sm={6} md={4} key={feature.key}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.features[feature.key] || false}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              features: {
                                ...prev.features,
                                [feature.key]: e.target.checked
                              }
                            }));
                          }}
                          disabled={!editing}
                          sx={{ color: '#ef4444', '&.Mui-checked': { color: '#ef4444' } }}
                        />
                      }
                      label={feature.label}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Özel Özellikler */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                  Özel Özellikler
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.features.customFeatures?.join('\n') || ''}
                  onChange={(e) => {
                    const customFeatures = e.target.value.split('\n').filter(f => f.trim());
                    setFormData(prev => ({
                      ...prev,
                      features: {
                        ...prev.features,
                        customFeatures
                      }
                    }));
                  }}
                  disabled={!editing}
                  placeholder="Her satıra bir özellik yazın (örn: Deniz manzarası, Açık büfe)"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: editing ? 'white' : '#f8fafc',
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

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
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BrandProfile;
