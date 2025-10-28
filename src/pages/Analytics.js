import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  People,
  MonetizationOn,
  Discount,
  Assessment,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import API_CONFIG from '../config/api';

function Analytics({ currentUser }) {
  const [analytics, setAnalytics] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadAnalytics();
      loadDailyData();
    }
  }, [currentUser]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/brand-weekly`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
        console.log('📊 Analytics yüklendi:', data.data);
      }
    } catch (error) {
      console.error('Analytics yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyData = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/brand-daily?days=7`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Grafik için veri formatla
        const formattedData = Object.entries(data.data.dailyStats)
          .map(([date, stats]) => ({
            date: new Date(date).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' }),
            codes: stats.codes,
            used: stats.used,
            revenue: stats.revenue,
            discount: stats.discount
          }))
          .reverse(); // Eski tarihler solda olsun
        
        setDailyData(formattedData);
        console.log('📈 Günlük data yüklendi:', formattedData);
      }
    } catch (error) {
      console.error('Daily data yükleme hatası:', error);
    }
  };

  const COLORS = ['#28A745', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="textSecondary">
          Analitik verileri yüklenemedi
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Assessment sx={{ mr: 2, fontSize: 32, color: '#28A745' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          İstatistikler ve Analitik
        </Typography>
      </Box>

      {/* Özet Kartlar */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    Toplam Kod
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1, color: 'white' }}>
                    {analytics.codes.total}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    {analytics.codes.used} kullanıldı
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    Toplam Ciro
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1, color: 'white' }}>
                    {analytics.revenue.totalRevenue.toFixed(0)}₺
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    İndirimli
                  </Typography>
                </Box>
                <MonetizationOn sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    Toplam İndirim
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1, color: 'white' }}>
                    {analytics.revenue.totalDiscountGiven.toFixed(0)}₺
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    Verilen
                  </Typography>
                </Box>
                <Discount sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    Müşteri
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1, color: 'white' }}>
                    {analytics.customers.usedCode}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                    Kullanan
                  </Typography>
                </Box>
                <People sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detaylı İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                📈 Dönüşüm Oranı
              </Typography>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                  %{analytics.codes.conversionRate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Kod Oluşturma → Kullanım
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                  {analytics.codes.total} koddan {analytics.codes.used} tanesi kullanıldı
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {analytics.revenue.totalOriginalAmount > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  💰 Gelir Özeti
                </Typography>
                <Box sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Toplam Hesap (İndirimsiz):</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {analytics.revenue.totalOriginalAmount.toFixed(2)} ₺
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="error">Verilen İndirim:</Typography>
                    <Typography variant="body1" fontWeight="bold" color="error">
                      -{analytics.revenue.totalDiscountGiven.toFixed(2)} ₺
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="bold">Net Ciro:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {analytics.revenue.totalRevenue.toFixed(2)} ₺
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Grafikler */}
      <Grid container spacing={3}>
        {/* Günlük Kod Kullanımı */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Günlük Kod Kullanımı (Son 7 Gün)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="codes" 
                  stroke="#8884d8" 
                  name="Oluşturulan Kod"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="used" 
                  stroke="#82ca9d" 
                  name="Kullanılan Kod"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gelir Grafiği */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Gelir Dağılımı
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Net Ciro', value: analytics.revenue.totalRevenue },
                    { name: 'Verilen İndirim', value: analytics.revenue.totalDiscountGiven },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: %${(percent * 100).toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#28A745" />
                  <Cell fill="#FF6384" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Günlük Gelir */}
        {dailyData.some(d => d.revenue > 0) && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Günlük Ciro ve İndirim
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#28A745" name="Ciro (₺)" />
                  <Bar dataKey="discount" fill="#FF6384" name="İndirim (₺)" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* En İyi Kampanya */}
        {analytics.campaigns.topCampaign && (
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                  En Popüler Kampanya
                </Typography>
                <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold', color: 'white' }}>
                  {analytics.campaigns.topCampaign.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {analytics.campaigns.topCampaign.usage} kez kullanıldı
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500 }}>
                  Tip: {analytics.campaigns.topCampaign.offerType === 'percentage' && 'Yüzde İndirim'}
                  {analytics.campaigns.topCampaign.offerType === 'fixedPrice' && 'Sabit Fiyat'}
                  {analytics.campaigns.topCampaign.offerType === 'freeItem' && 'Bedava Ürün'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Kampanya Tipleri Dağılımı */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Kampanya Tipleri
              </Typography>
              <Box sx={{ py: 2 }}>
                {Object.entries(analytics.campaigns.offerTypeDistribution).map(([type, count]) => (
                  <Box key={type} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {type === 'percentage' && 'Yüzde İndirim'}
                        {type === 'fixedPrice' && 'Sabit Fiyat'}
                        {type === 'freeItem' && 'Bedava Ürün'}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {count} kampanya
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      width: '100%', 
                      height: 8, 
                      bgcolor: '#E9ECEF', 
                      borderRadius: 1 
                    }}>
                      <Box sx={{ 
                        width: `${(count / analytics.campaigns.total) * 100}%`, 
                        height: '100%', 
                        bgcolor: '#28A745', 
                        borderRadius: 1 
                      }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Müşteri İstatistikleri */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                📱 Toplam Unique Müşteri
              </Typography>
              <Typography variant="h4">
                {analytics.customers.totalUnique}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                ✅ Kod Kullanan Müşteri
              </Typography>
              <Typography variant="h4" color="success.main">
                {analytics.customers.usedCode}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                🎯 Aktif Kampanya
              </Typography>
              <Typography variant="h4" color="primary">
                {analytics.campaigns.active}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                / {analytics.campaigns.total} toplam
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analytics;
