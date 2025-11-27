import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  Mouse,
  QrCode,
  TrendingUp,
  People,
  Campaign,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import API_CONFIG from '../config/api';

function Analytics({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [overviewData, setOverviewData] = useState(null);
  const [bannerStats, setBannerStats] = useState(null);
  const [qrStats, setQrStats] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser, days]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [overviewRes, bannerRes, qrRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/api/analytics/overview?days=${days}`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/api/analytics/banner-stats?days=${days}`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/api/analytics/qr-stats?days=${days}`, { headers }),
      ]);

      const [overviewData, bannerData, qrData] = await Promise.all([
        overviewRes.json(),
        bannerRes.json(),
        qrRes.json(),
      ]);

      if (overviewData.success) setOverviewData(overviewData.data);
      if (bannerData.success) setBannerStats(bannerData.data);
      if (qrData.success) setQrStats(qrData.data);
    } catch (error) {
      console.error('Analytics yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color = '#ef4444' }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
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
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28, color: 'white' } })}
          </Box>
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            İstatistikler
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Kampanyalarınızın performansını takip edin
          </Typography>
        </Box>

        {/* Period Selector */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          {[7, 30, 90].map((d) => (
            <Chip
              key={d}
              label={`Son ${d} Gün`}
              onClick={() => setDays(d)}
              color={days === d ? 'primary' : 'default'}
              sx={{
                cursor: 'pointer',
                backgroundColor: days === d ? '#ef4444' : 'white',
                color: days === d ? 'white' : '#64748b',
                '&:hover': {
                  backgroundColor: days === d ? '#dc2626' : '#f1f5f9',
                },
              }}
            />
          ))}
        </Box>

        {/* Overview Stats */}
        {overviewData && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Visibility />}
                title="Toplam Görüntülenme"
                value={overviewData.clicks.views.toLocaleString()}
                subtitle={`${days} gün içinde`}
                color="#3b82f6"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Mouse />}
                title="Toplam Tıklama"
                value={overviewData.clicks.clicks.toLocaleString()}
                subtitle={`%${overviewData.clicks.clickThroughRate} tıklama oranı`}
                color="#ef4444"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<QrCode />}
                title="QR Kod Oluşturuldu"
                value={overviewData.qrCodes.generated.toLocaleString()}
                subtitle={`${overviewData.qrCodes.used} kullanıldı`}
                color="#10b981"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<TrendingUp />}
                title="QR Kod Dönüşüm Oranı"
                value={`%${overviewData.qrCodes.conversionRate}`}
                subtitle={`${overviewData.qrCodes.used}/${overviewData.qrCodes.generated} kullanıldı`}
                color="#f59e0b"
              />
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: '1px solid #e2e8f0',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
              },
            }}
          >
            <Tab label="Banner Tıklamaları" />
            <Tab label="QR Kod İstatistikleri" />
            <Tab label="Genel Bakış" />
          </Tabs>
        </Card>

        {/* Tab Content */}
        {activeTab === 0 && bannerStats && (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Banner Tıklamaları Detayları
              </Typography>

              {/* Summary */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, backgroundColor: '#eff6ff', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      Toplam Görüntülenme
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                      {bannerStats.totals.views.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      Toplam Tıklama
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef4444' }}>
                      {bannerStats.totals.clicks.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      Tıklama Oranı
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>
                      %{bannerStats.totals.clickThroughRate}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Banner List */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Banner Bazında İstatistikler
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Banner Adı</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Görüntülenme</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Tıklama</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Beğeni</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Paylaşım</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Arama</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Yol Tarifi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bannerStats.byBanner.length > 0 ? (
                      bannerStats.byBanner.map((banner) => (
                        <TableRow key={banner.bannerId} hover>
                          <TableCell>{banner.bannerTitle}</TableCell>
                          <TableCell align="right">{banner.views || 0}</TableCell>
                          <TableCell align="right">{banner.clicks || 0}</TableCell>
                          <TableCell align="right">{banner.likes || 0}</TableCell>
                          <TableCell align="right">{banner.shares || 0}</TableCell>
                          <TableCell align="right">{banner.calls || 0}</TableCell>
                          <TableCell align="right">{banner.directions || 0}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Henüz banner tıklaması kaydı bulunmuyor
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && qrStats && (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                QR Kod İstatistikleri Detayları
              </Typography>

              {/* Summary */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      Oluşturulan
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {qrStats.totals.generated.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ p: 2, backgroundColor: '#eff6ff', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      Kullanılan
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                      {qrStats.totals.used.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ p: 2, backgroundColor: '#fffbeb', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      Kullanılmayan
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {qrStats.totals.unused.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      Dönüşüm Oranı
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef4444' }}>
                      %{qrStats.totals.conversionRate}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Banner List */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Banner Bazında QR Kod İstatistikleri
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Banner Adı</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Oluşturulan</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Kullanılan</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Kullanılmayan</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Dönüşüm Oranı</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {qrStats.byBanner.length > 0 ? (
                      qrStats.byBanner.map((banner) => (
                        <TableRow key={banner.bannerId} hover>
                          <TableCell>{banner.bannerTitle}</TableCell>
                          <TableCell align="right">{banner.generated}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              {banner.used}
                              <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              {banner.unused}
                              <Cancel sx={{ fontSize: 16, color: '#ef4444' }} />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={banner.conversionRate}
                                sx={{
                                  width: 100,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#e2e8f0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: banner.conversionRate > 50 ? '#10b981' : '#f59e0b',
                                    borderRadius: 4,
                                  },
                                }}
                              />
                              <Typography variant="body2" sx={{ minWidth: 45, fontWeight: 600 }}>
                                %{banner.conversionRate}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Henüz QR kod oluşturulmamış
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && overviewData && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Banner İstatistikleri
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Toplam Banner
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {overviewData.banners.total}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Aktif Banner
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#10b981' }}>
                        {overviewData.banners.active}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Toplam Görüntülenme
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {overviewData.clicks.views.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Toplam Tıklama
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#ef4444' }}>
                        {overviewData.clicks.clicks.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Tıklama Oranı
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                        %{overviewData.clicks.clickThroughRate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Benzersiz Kullanıcı
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {overviewData.clicks.uniqueUsers}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    QR Kod İstatistikleri
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Oluşturulan QR Kod
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {overviewData.qrCodes.generated.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Kullanılan QR Kod
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#10b981' }}>
                        {overviewData.qrCodes.used.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Kullanılmayan QR Kod
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#f59e0b' }}>
                        {overviewData.qrCodes.unused.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Dönüşüm Oranı
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#ef4444' }}>
                        %{overviewData.qrCodes.conversionRate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Benzersiz Kullanıcı
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {overviewData.qrCodes.uniqueUsers}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default Analytics;
