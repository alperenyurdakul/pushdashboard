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
  Avatar,
  IconButton,
  Divider,
  alpha,
} from '@mui/material';
import {
  Restaurant,
  Campaign,
  TrendingUp,
  Visibility,
  Add,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Notifications,
  Event,
  People,
  BarChart,
  PieChart,
  Assessment,
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
    revenue: 125000,
    revenueChange: 12.5,
    viewsChange: 8.3,
    clicksChange: -2.1,
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
      revenue: 8900,
      trend: 'up',
    },
    {
      id: 2,
      title: 'Öğle Menü Fırsatı',
      restaurant: 'Lezzet Durağı',
      status: 'active',
      views: 890,
      clicks: 67,
      conversion: 7.5,
      revenue: 6700,
      trend: 'up',
    },
    {
      id: 3,
      title: 'Hafta Sonu Brunch',
      restaurant: 'Güzel Kahve',
      status: 'draft',
      views: 0,
      clicks: 0,
      conversion: 0,
      revenue: 0,
      trend: 'neutral',
    },
  ];

  const customerEvents = [];

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

  const StatCard = ({ icon, title, value, subtitle, change, trend, color = 'primary' }) => {
    const colors = {
      primary: { bg: 'linear-gradient(135deg, #ff615e 0%, #ff8582 100%)', icon: '#ff615e' },
      secondary: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '#667eea' },
      success: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: '#11998e' },
      warning: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '#f093fb' },
      info: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '#4facfe' },
    };

    const cardColor = colors[color] || colors.primary;

    return (
      <Card
        sx={{
          background: cardColor.bg,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: alpha('#fff', 0.1),
          }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: alpha('#fff', 0.2),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 28, color: 'white' } })}
            </Box>
            {change && (
              <Chip
                icon={trend === 'up' ? <ArrowUpward sx={{ fontSize: 16 }} /> : <ArrowDownward sx={{ fontSize: 16 }} />}
                label={`${change > 0 ? '+' : ''}${change}%`}
                size="small"
                sx={{
                  background: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff615e 0%, #667eea 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Hoş Geldiniz, {currentUser?.name}! 👋
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
              {isBrand
                ? 'Kampanyalarınızı yönetin ve performansınızı takip edin'
                : 'Etkinliklere katılın ve bildirimlerinizi takip edin'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              sx={{
                background: 'white',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': { background: '#f5f5f5' },
              }}
            >
              <Notifications />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: 'linear-gradient(135deg, #ff615e 0%, #ff8582 100%)',
                boxShadow: '0px 4px 12px rgba(255, 97, 94, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff3d3a 0%, #ff615e 100%)',
                  boxShadow: '0px 6px 16px rgba(255, 97, 94, 0.4)',
                },
              }}
            >
              {isBrand ? 'Yeni Kampanya' : 'Yeni Etkinlik'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {isBrand ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Restaurant />}
                title="Toplam Restoran"
                value={stats.totalRestaurants}
                subtitle="Aktif işletmeler"
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Campaign />}
                title="Aktif Kampanyalar"
                value={stats.activeCampaigns}
                subtitle="Şu anda çalışan"
                change={stats.viewsChange}
                trend="up"
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Visibility />}
                title="Aylık Görüntülenme"
                value={stats.monthlyViews.toLocaleString()}
                subtitle="Bu ay"
                change={stats.viewsChange}
                trend="up"
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<TrendingUp />}
                title="Dönüşüm Oranı"
                value={`%${stats.conversionRate}`}
                subtitle="Ortalama"
                change={stats.clicksChange}
                trend={stats.clicksChange > 0 ? 'up' : 'down'}
                color="success"
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Event />}
                title="Toplam Etkinlik"
                value={stats.totalEvents}
                subtitle="Oluşturduğunuz"
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<People />}
                title="Katıldığınız"
                value={stats.participatedEvents}
                subtitle="Etkinlikler"
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Notifications />}
                title="Yaklaşan"
                value={stats.upcomingEvents}
                subtitle="Etkinlikler"
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Notifications />}
                title="Bildirimler"
                value={stats.notifications}
                subtitle="Okunmamış"
                color="warning"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Quick Actions & Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: 'white',
              borderRadius: 3,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {isBrand ? 'Son Kampanyalar' : 'Son Etkinlikler'}
                </Typography>
                <Button variant="text" size="small" sx={{ color: '#ff615e' }}>
                  Tümünü Gör
                </Button>
              </Box>

              {recentItems.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentItems.map((item, index) => (
                    <Box key={item.id}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          background: index % 2 === 0 ? '#f8f9fa' : 'white',
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: '#f0f0f0',
                            transform: 'translateX(4px)',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {item.title}
                              </Typography>
                              <Chip
                                label={getStatusText(item.status)}
                                color={getStatusColor(item.status)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {item.restaurant}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={3}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Görüntülenme
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {item.views.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Tıklama
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {item.clicks.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Dönüşüm
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#11998e' }}>
                                %{item.conversion}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Trend
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {item.trend === 'up' ? (
                                  <ArrowUpward sx={{ color: '#11998e', fontSize: 20 }} />
                                ) : item.trend === 'down' ? (
                                  <ArrowDownward sx={{ color: '#f5576c', fontSize: 20 }} />
                                ) : (
                                  <TrendingUp sx={{ color: '#7f8c8d', fontSize: 20 }} />
                                )}
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>

                        {item.status === 'active' && (
                          <Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min((item.clicks / item.views) * 100, 100)}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                background: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #ff615e 0%, #ff8582 100%)',
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                      {index < recentItems.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff615e 0%, #ff8582 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {isBrand ? (
                      <Campaign sx={{ fontSize: 40, color: 'white' }} />
                    ) : (
                      <Event sx={{ fontSize: 40, color: 'white' }} />
                    )}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {isBrand ? 'Henüz kampanya oluşturmadınız' : 'Henüz etkinlik oluşturmadınız'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {isBrand
                      ? 'İlk kampanyanızı oluşturmak için "Bannerlar" sayfasına gidin.'
                      : 'İlk etkinliğinizi oluşturmak için "Etkinlikler" sayfasına gidin.'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      background: 'linear-gradient(135deg, #ff615e 0%, #ff8582 100%)',
                      boxShadow: '0px 4px 12px rgba(255, 97, 94, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff3d3a 0%, #ff615e 100%)',
                        boxShadow: '0px 6px 16px rgba(255, 97, 94, 0.4)',
                      },
                    }}
                    onClick={() => (window.location.href = isBrand ? '/banners' : '/events')}
                  >
                    {isBrand ? 'Kampanya Oluştur' : 'Etkinlik Oluştur'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background: 'white',
                  borderRadius: 3,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Hızlı İşlemler
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {isBrand ? (
                      <>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Restaurant />}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: '#e0e0e0',
                            '&:hover': {
                              borderColor: '#ff615e',
                              background: alpha('#ff615e', 0.05),
                            },
                          }}
                        >
                          Yeni Restoran
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Campaign />}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: '#e0e0e0',
                            '&:hover': {
                              borderColor: '#ff615e',
                              background: alpha('#ff615e', 0.05),
                            },
                          }}
                        >
                          Kampanya Oluştur
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<BarChart />}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: '#e0e0e0',
                            '&:hover': {
                              borderColor: '#ff615e',
                              background: alpha('#ff615e', 0.05),
                            },
                          }}
                        >
                          Analitik Görüntüle
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Add />}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: '#e0e0e0',
                            '&:hover': {
                              borderColor: '#ff615e',
                              background: alpha('#ff615e', 0.05),
                            },
                          }}
                        >
                          Etkinlik Oluştur
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Event />}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: '#e0e0e0',
                            '&:hover': {
                              borderColor: '#ff615e',
                              background: alpha('#ff615e', 0.05),
                            },
                          }}
                        >
                          Etkinlikleri Gör
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* System Status */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background: 'white',
                  borderRadius: 3,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Sistem Durumu
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#11998e',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%': { opacity: 1 },
                              '50%': { opacity: 0.5 },
                              '100%': { opacity: 1 },
                            },
                          }}
                        />
                        <Typography variant="body2">AI Servisi</Typography>
                      </Box>
                      <Chip label="Çalışıyor" color="success" size="small" sx={{ fontWeight: 600 }} />
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#11998e',
                            animation: 'pulse 2s infinite',
                          }}
                        />
                        <Typography variant="body2">Veritabanı</Typography>
                      </Box>
                      <Chip label="Aktif" color="success" size="small" sx={{ fontWeight: 600 }} />
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#11998e',
                            animation: 'pulse 2s infinite',
                          }}
                        />
                        <Typography variant="body2">API</Typography>
                      </Box>
                      <Chip label="Çalışıyor" color="success" size="small" sx={{ fontWeight: 600 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
