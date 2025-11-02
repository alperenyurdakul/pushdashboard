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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Visibility,
} from '@mui/icons-material';
import API_CONFIG from '../config/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminPanel() {
  const [tabValue, setTabValue] = useState(0);
  const [pendingBanners, setPendingBanners] = useState([]);
  const [approvedBanners, setApprovedBanners] = useState([]);
  const [rejectedBanners, setRejectedBanners] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    loadStats();
    loadPendingBanners();
    loadApprovedBanners();
    loadRejectedBanners();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };

  const loadPendingBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/banners/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Event'leri de al
      const eventsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/admin/events/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const eventsData = await eventsResponse.json();
      
      // Banner'lar ve event'leri birleştir
      let allPending = [];
      if (data.success) {
        allPending = [...data.data];
      }
      if (eventsData.success && eventsData.data.length > 0) {
        const formattedEvents = eventsData.data.map(event => ({
          _id: event._id,
          title: event.title,
          description: event.description,
          category: event.category,
          contentType: 'event',
          approvalStatus: 'pending',
          createdAt: event.createdAt,
          restaurant: { name: event.organizerName },
          bannerImage: event.bannerImage,
          isEvent: true
        }));
        allPending = [...allPending, ...formattedEvents];
      }
      
      setPendingBanners(allPending);
    } catch (error) {
      console.error('Pending banners yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApprovedBanners = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/banners/approved`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setApprovedBanners(data.data);
      }
    } catch (error) {
      console.error('Approved banners yükleme hatası:', error);
    }
  };

  const loadRejectedBanners = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/banners/rejected`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRejectedBanners(data.data);
      }
    } catch (error) {
      console.error('Rejected banners yükleme hatası:', error);
    }
  };

  const handleApproveBanner = async (banner) => {
    try {
      const isEvent = banner.isEvent || banner.contentType === 'event';
      const endpoint = isEvent 
        ? `${API_CONFIG.BASE_URL}/api/admin/events/${banner._id}/approve`
        : `${API_CONFIG.BASE_URL}/api/admin/banners/${banner._id}/approve`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const msg = isEvent ? 'Etkinlik başarıyla onaylandı!' : 'Banner başarıyla onaylandı ve kullanıcılara bildirim gönderildi!';
        alert(msg);
        loadPendingBanners();
        loadApprovedBanners();
        loadStats();
      } else {
        alert(`Hata: ${data.message}`);
      }
    } catch (error) {
      console.error('Onaylama hatası:', error);
      alert('Onaylanırken hata oluştu!');
    }
  };

  const handleRejectBanner = async () => {
    if (!selectedBanner || !rejectReason.trim()) {
      alert('Lütfen red sebebi girin!');
      return;
    }

    try {
      const isEvent = selectedBanner.isEvent || selectedBanner.contentType === 'event';
      const endpoint = isEvent 
        ? `${API_CONFIG.BASE_URL}/api/admin/events/${selectedBanner._id}/reject`
        : `${API_CONFIG.BASE_URL}/api/admin/banners/${selectedBanner._id}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      const data = await response.json();
      
      if (data.success) {
        const msg = isEvent ? 'Etkinlik reddedildi!' : 'Banner reddedildi!';
        alert(msg);
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedBanner(null);
        loadPendingBanners();
        loadRejectedBanners();
        loadStats();
      } else {
        alert(`Hata: ${data.message}`);
      }
    } catch (error) {
      console.error('Reddetme hatası:', error);
      alert('Reddedilirken hata oluştu!');
    }
  };

  const openRejectDialog = (banner) => {
    setSelectedBanner(banner);
    setRejectDialogOpen(true);
  };

  const openDetailDialog = (banner) => {
    setSelectedBanner(banner);
    setDetailDialogOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderBannerTable = (banners, showActions = false) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Başlık</TableCell>
            <TableCell>Marka</TableCell>
            <TableCell>Kategori</TableCell>
            <TableCell>Tür</TableCell>
            <TableCell>Oluşturulma</TableCell>
            <TableCell align="center">İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {banners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="textSecondary">Banner bulunamadı</Typography>
              </TableCell>
            </TableRow>
          ) : (
            banners.map((banner) => (
              <TableRow key={banner._id}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {banner.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {banner.description}
                  </Typography>
                </TableCell>
                <TableCell>{banner.restaurant?.name || '-'}</TableCell>
                <TableCell>
                  <Chip label={banner.category} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={banner.contentType === 'event' ? 'Etkinlik' : 'Kampanya'} 
                    size="small" 
                    color={banner.contentType === 'event' ? 'secondary' : 'primary'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {formatDate(banner.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => openDetailDialog(banner)}
                  >
                    Detay
                  </Button>
                  {showActions && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApproveBanner(banner)}
                        sx={{ ml: 1 }}
                      >
                        Onayla
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => openRejectDialog(banner)}
                        sx={{ ml: 1 }}
                      >
                        Reddet
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Admin Panel
      </Typography>

      {/* İstatistikler */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Bekleyen Banner
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.banners.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Onaylanan Banner
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.banners.approved}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Reddedilen Banner
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stats.banners.rejected}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Toplam Marka
                </Typography>
                <Typography variant="h4">
                  {stats.users.brands}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            label={`Bekleyen (${pendingBanners.length})`} 
            icon={<Schedule />} 
            iconPosition="start"
          />
          <Tab 
            label={`Onaylanan (${approvedBanners.length})`} 
            icon={<CheckCircle />} 
            iconPosition="start"
          />
          <Tab 
            label={`Reddedilen (${rejectedBanners.length})`} 
            icon={<Cancel />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderBannerTable(pendingBanners, true)
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderBannerTable(approvedBanners, false)}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderBannerTable(rejectedBanners, false)}
      </TabPanel>

      {/* Detay Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Banner Detayları</DialogTitle>
        <DialogContent>
          {selectedBanner && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedBanner.title}</Typography>
              <Typography variant="body2" paragraph>{selectedBanner.description}</Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Marka</Typography>
                  <Typography variant="body2">{selectedBanner.restaurant?.name || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Kategori</Typography>
                  <Typography variant="body2">{selectedBanner.category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Tür</Typography>
                  <Typography variant="body2">
                    {selectedBanner.contentType === 'event' ? 'Etkinlik' : 'Kampanya'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Onay Durumu</Typography>
                  <Typography variant="body2">
                    {selectedBanner.approvalStatus === 'pending' && 'Bekliyor'}
                    {selectedBanner.approvalStatus === 'approved' && 'Onaylandı'}
                    {selectedBanner.approvalStatus === 'rejected' && 'Reddedildi'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">AI Oluşturulan Metin</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedBanner.aiGeneratedText}
                  </Typography>
                </Grid>
                {selectedBanner.rejectedReason && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      <Typography variant="caption" fontWeight="bold">Red Sebebi:</Typography>
                      <Typography variant="body2">{selectedBanner.rejectedReason}</Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Reddetme Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Banner'ı Reddet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Red Sebebi"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>İptal</Button>
          <Button onClick={handleRejectBanner} color="error" variant="contained">
            Reddet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPanel;

