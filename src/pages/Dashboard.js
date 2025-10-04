import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Restaurant,
  Campaign,
  TrendingUp,
  Visibility,
  Add,
} from '@mui/icons-material';

function Dashboard({ currentUser }) {
  // Kullanıcı tipine göre farklı içerik göster
  const isBrand = currentUser?.userType === 'brand';
  
  // Brand için mock data
  const brandStats = {
    totalRestaurants: 24,
    activeCampaigns: 8,
    totalBanners: 156,
    monthlyViews: 12450,
    monthlyClicks: 890,
    conversionRate: 7.1,
  };

  // Customer için mock data
  const customerStats = {
    totalEvents: 0,
    participatedEvents: 0,
    upcomingEvents: 0,
    notifications: 0,
  };

  const brandCampaigns = [
    {
      id: 1,
      title: 'Akşam Kahve Kampanyası',
      restaurant: 'Kahve Dünyası',
      status: 'active',
      views: 1250,
      clicks: 89,
      conversion: 7.1,
    },
    {
      id: 2,
      title: 'Öğle Menü Fırsatı',
      restaurant: 'Lezzet Durağı',
      status: 'active',
      views: 890,
      clicks: 67,
      conversion: 7.5,
    },
    {
      id: 3,
      title: 'Hafta Sonu Brunch',
      restaurant: 'Güzel Kahve',
      status: 'draft',
      views: 0,
      clicks: 0,
      conversion: 0,
    },
  ];

  const customerEvents = [
    // Yeni kullanıcı için boş liste
  ];

  const stats = isBrand ? brandStats : customerStats;
  const recentItems = isBrand ? brandCampaigns : customerEvents;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'paused':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'draft':
        return 'Taslak';
      case 'paused':
        return 'Duraklatıldı';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hoş Geldiniz, {currentUser?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isBrand 
            ? 'AI Banner Generator ile kampanyalarınızı yönetin ve performansınızı takip edin.'
            : 'Etkinliklere katılın ve bildirimlerinizi takip edin.'
          }
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {isBrand ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Restaurant color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Toplam Restoran
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.totalRestaurants}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aktif işletmeler
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Campaign color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Aktif Kampanyalar
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.activeCampaigns}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Şu anda çalışan
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Visibility color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Aylık Görüntülenme
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.monthlyViews.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bu ay
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Dönüşüm Oranı
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    %{stats.conversionRate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ortalama
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Campaign color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Toplam Etkinlik
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.totalEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Oluşturduğunuz
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Katıldığınız
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.participatedEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Etkinlikler
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Visibility color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Yaklaşan
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.upcomingEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Etkinlikler
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Add color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Bildirimler
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.notifications}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Okunmamış
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hızlı İşlemler
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {isBrand ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      size="small"
                    >
                      Yeni Restoran
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Campaign />}
                      size="small"
                    >
                      Kampanya Oluştur
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                    >
                      Banner Önizle
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      size="small"
                    >
                      Etkinlik Oluştur
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Campaign />}
                      size="small"
                    >
                      Etkinlikleri Gör
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sistem Durumu
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">AI Servisi</Typography>
                  <Chip label="Çalışıyor" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Veritabanı</Typography>
                  <Chip label="Aktif" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">API</Typography>
                  <Chip label="Çalışıyor" color="success" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Items */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {isBrand ? 'Son Kampanyalar' : 'Son Etkinlikler'}
            </Typography>
            <Button variant="outlined" size="small">
              Tümünü Gör
            </Button>
          </Box>

          {recentItems.length > 0 ? (
            <Grid container spacing={2}>
              {recentItems.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      <Chip
                        label={getStatusText(item.status)}
                        color={getStatusColor(item.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.restaurant}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Görüntülenme
                        </Typography>
                        <Typography variant="h6">
                          {item.views.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Tıklama
                        </Typography>
                        <Typography variant="h6">
                          {item.clicks.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Dönüşüm
                        </Typography>
                        <Typography variant="h6">
                          %{item.conversion}
                        </Typography>
                      </Grid>
                    </Grid>

                    {item.status === 'active' && (
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((item.clicks / item.views) * 100, 100)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {isBrand ? 'Henüz kampanya oluşturmadınız' : 'Henüz etkinlik oluşturmadınız'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {isBrand 
                  ? 'İlk kampanyanızı oluşturmak için "Bannerlar" sayfasına gidin.'
                  : 'İlk etkinliğinizi oluşturmak için "Etkinlikler" sayfasına gidin.'
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => window.location.href = isBrand ? '/banners' : '/events'}
              >
                {isBrand ? 'Kampanya Oluştur' : 'Etkinlik Oluştur'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard; 