import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Visibility,
  TouchApp,
  People,
  LocationOn,
  Phone,
  Share,
  Favorite,
  Restaurant,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';

function Analytics({ currentBrand }) {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    userActions: [],
    topBanners: [],
    userDemographics: {},
    locationData: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, currentBrand]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data - gerçek projede API'den gelecek
      const mockData = {
        overview: {
          totalViews: 15420,
          totalClicks: 2340,
          totalUsers: 1890,
          conversionRate: 15.2,
          avgSessionDuration: 45
        },
        userActions: [
          { action: 'view', count: 15420, percentage: 100 },
          { action: 'click', count: 2340, percentage: 15.2 },
          { action: 'like', count: 890, percentage: 5.8 },
          { action: 'share', count: 456, percentage: 3.0 },
          { action: 'call', count: 234, percentage: 1.5 },
          { action: 'directions', count: 123, percentage: 0.8 }
        ],
        topBanners: [
          {
            id: '1',
            title: 'Akşam Kahve Kampanyası',
            views: 3250,
            clicks: 567,
            conversionRate: 17.4,
            restaurant: 'Kahve Dünyası'
          },
          {
            id: '2',
            title: 'Öğle Menü Fırsatı',
            views: 2890,
            clicks: 423,
            conversionRate: 14.6,
            restaurant: 'Lezzet Durağı'
          },
          {
            id: '3',
            title: 'Hafta Sonu Brunch',
            views: 2340,
            clicks: 345,
            conversionRate: 14.7,
            restaurant: 'Güzel Kahve'
          }
        ],
        userDemographics: {
          ageGroups: [
            { range: '18-25', count: 890, percentage: 47.1 },
            { range: '26-35', count: 567, percentage: 30.0 },
            { range: '36-45', count: 234, percentage: 12.4 },
            { range: '46+', count: 199, percentage: 10.5 }
          ],
          gender: [
            { type: 'Kadın', count: 1023, percentage: 54.1 },
            { type: 'Erkek', count: 867, percentage: 45.9 }
          ]
        },
        locationData: [
          { city: 'İstanbul', district: 'Kadıköy', count: 567, percentage: 30.0 },
          { city: 'İstanbul', district: 'Beşiktaş', count: 456, percentage: 24.1 },
          { city: 'İstanbul', district: 'Şişli', count: 345, percentage: 18.3 },
          { city: 'İstanbul', district: 'Beyoğlu', count: 234, percentage: 12.4 },
          { city: 'İstanbul', district: 'Diğer', count: 288, percentage: 15.2 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Analytics yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'view': return <Visibility color="primary" />;
      case 'click': return <TouchApp color="success" />;
      case 'like': return <Favorite color="error" />;
      case 'share': return <Share color="info" />;
      case 'call': return <Phone color="warning" />;
      case 'directions': return <LocationOn color="secondary" />;
      default: return <TrendingUp />;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'view': return 'Görüntüleme';
      case 'click': return 'Tıklama';
      case 'like': return 'Beğeni';
      case 'share': return 'Paylaşım';
      case 'call': return 'Arama';
      case 'directions': return 'Yol Tarifi';
      default: return action;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'view': return 'primary';
      case 'click': return 'success';
      case 'like': return 'error';
      case 'share': return 'info';
      case 'call': return 'warning';
      case 'directions': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          📊 Banner Analitikleri
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Zaman Aralığı</InputLabel>
          <Select
            value={timeRange}
            label="Zaman Aralığı"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="1d">Son 24 Saat</MenuItem>
            <MenuItem value="7d">Son 7 Gün</MenuItem>
            <MenuItem value="30d">Son 30 Gün</MenuItem>
            <MenuItem value="90d">Son 3 Ay</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Genel İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Visibility color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Görüntülenme
                  </Typography>
                  <Typography variant="h4">
                    {analyticsData.overview.totalViews?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TouchApp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Tıklama
                  </Typography>
                  <Typography variant="h4">
                    {analyticsData.overview.totalClicks?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Kullanıcı
                  </Typography>
                  <Typography variant="h4">
                    {analyticsData.overview.totalUsers?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Dönüşüm Oranı
                  </Typography>
                  <Typography variant="h4">
                    %{analyticsData.overview.conversionRate}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tab'lar */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Genel Bakış" />
          <Tab label="Kullanıcı Aksiyonları" />
          <Tab label="En İyi Banner'lar" />
          <Tab label="Kullanıcı Demografisi" />
          <Tab label="Lokasyon Analizi" />
        </Tabs>
      </Box>

      {/* Tab İçerikleri */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎯 Kullanıcı Aksiyonları
                </Typography>
                <List>
                  {analyticsData.userActions.map((action, index) => (
                    <React.Fragment key={action.action}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: `${getActionColor(action.action)}.main` }}>
                            {getActionIcon(action.action)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={getActionText(action.action)}
                          secondary={`${action.count.toLocaleString()} (${action.percentage}%)`}
                        />
                      </ListItem>
                      {index < analyticsData.userActions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📍 Lokasyon Dağılımı
                </Typography>
                <List>
                  {analyticsData.locationData.slice(0, 5).map((location, index) => (
                    <React.Fragment key={`${location.city}-${location.district}`}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <LocationOn />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${location.district}, ${location.city}`}
                          secondary={`${location.count} kullanıcı (${location.percentage}%)`}
                        />
                      </ListItem>
                      {index < 4 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Kullanıcı Aksiyon Detayları
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Aksiyon</TableCell>
                    <TableCell align="right">Sayı</TableCell>
                    <TableCell align="right">Yüzde</TableCell>
                    <TableCell align="right">Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.userActions.map((action) => (
                    <TableRow key={action.action}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getActionIcon(action.action)}
                          <Typography sx={{ ml: 1 }}>
                            {getActionText(action.action)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">
                          {action.count.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`%${action.percentage}`} 
                          color={getActionColor(action.action)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TrendingUp color="success" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🏆 En İyi Performans Gösteren Banner'lar
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Banner</TableCell>
                    <TableCell>Restoran</TableCell>
                    <TableCell align="right">Görüntülenme</TableCell>
                    <TableCell align="right">Tıklama</TableCell>
                    <TableCell align="right">Dönüşüm Oranı</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.topBanners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {banner.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={<Restaurant />} 
                          label={banner.restaurant} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {banner.views.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {banner.clicks.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`%${banner.conversionRate}`} 
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  👥 Yaş Grupları
                </Typography>
                <List>
                  {analyticsData.userDemographics.ageGroups.map((ageGroup) => (
                    <ListItem key={ageGroup.range}>
                      <ListItemText
                        primary={`${ageGroup.range} yaş`}
                        secondary={`${ageGroup.count} kullanıcı (${ageGroup.percentage}%)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🚻 Cinsiyet Dağılımı
                </Typography>
                <List>
                  {analyticsData.userDemographics.gender.map((gender) => (
                    <ListItem key={gender.type}>
                      <ListItemText
                        primary={gender.type}
                        secondary={`${gender.count} kullanıcı (${gender.percentage}%)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🗺️ Lokasyon Bazlı Analiz
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Şehir</TableCell>
                    <TableCell>İlçe</TableCell>
                    <TableCell align="right">Kullanıcı Sayısı</TableCell>
                    <TableCell align="right">Yüzde</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.locationData.map((location) => (
                    <TableRow key={`${location.city}-${location.district}`}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn color="primary" sx={{ mr: 1 }} />
                          {location.city}
                        </Box>
                      </TableCell>
                      <TableCell>{location.district}</TableCell>
                      <TableCell align="right">
                        {location.count.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`%${location.percentage}`} 
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Analytics; 