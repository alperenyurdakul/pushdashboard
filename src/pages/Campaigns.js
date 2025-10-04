import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Campaign,
  PlayArrow,
  Pause,
} from '@mui/icons-material';

function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data - gerçek projede API'den gelecek
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: 'Akşam Kahve Kampanyası',
      restaurant: 'Kahve Dünyası',
      status: 'active',
      description: 'Saat 18:00\'dan sonra kahve alana cheesecake ücretsiz!',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      startTime: '18:00',
      endTime: '23:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      targetAudience: '18-45 yaş',
      budget: 5000,
      spent: 3200,
    },
    {
      id: 2,
      title: 'Öğle Menü Fırsatı',
      restaurant: 'Lezzet Durağı',
      status: 'active',
      description: 'Öğle menüsünde %20 indirim!',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      startTime: '11:00',
      endTime: '15:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      targetAudience: '25-55 yaş',
      budget: 3000,
      spent: 1800,
    },
    {
      id: 3,
      title: 'Hafta Sonu Brunch',
      restaurant: 'Güzel Kahve',
      status: 'draft',
      description: 'Hafta sonu brunch keyfi!',
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      startTime: '09:00',
      endTime: '14:00',
      daysOfWeek: ['saturday', 'sunday'],
      targetAudience: 'Tüm yaşlar',
      budget: 2000,
      spent: 0,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'paused':
        return 'info';
      case 'completed':
        return 'default';
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
      case 'completed':
        return 'Tamamlandı';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <PlayArrow />;
      case 'draft':
        return <Edit />;
      case 'paused':
        return <Pause />;
      case 'completed':
        return <Campaign />;
      default:
        return <Campaign />;
    }
  };

  const getDaysText = (days) => {
    const dayMap = {
      monday: 'Pzt',
      tuesday: 'Sal',
      wednesday: 'Çar',
      thursday: 'Per',
      friday: 'Cum',
      saturday: 'Cmt',
      sunday: 'Paz',
    };
    return days.map(day => dayMap[day]).join(', ');
  };

  const getBudgetProgress = (spent, budget) => {
    return Math.round((spent / budget) * 100);
  };

  const handleView = (campaign) => {
    setSelectedCampaign(campaign);
    setViewDialogOpen(true);
  };

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setEditDialogOpen(true);
  };

  const handleDelete = (campaign) => {
    setSelectedCampaign(campaign);
    setDeleteDialogOpen(true);
  };

  const handleStatusChange = (campaignId, newStatus) => {
    setCampaigns(prev => 
      prev.map(c => c.id === campaignId ? { ...c, status: newStatus } : c)
    );
    setSnackbar({
      open: true,
      message: `Kampanya durumu ${getStatusText(newStatus)} olarak güncellendi`,
      severity: 'success'
    });
  };

  const confirmDelete = () => {
    setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
    setDeleteDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Kampanya başarıyla silindi',
      severity: 'success'
    });
  };

  const handleEditSave = (updatedCampaign) => {
    setCampaigns(prev => 
      prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c)
    );
    setEditDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Kampanya başarıyla güncellendi',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Kampanya Yönetimi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Restoran kampanyalarınızı yönetin ve performanslarını takip edin.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          sx={{ mr: 2 }}
          onClick={() => setEditDialogOpen(true)}
        >
          Yeni Kampanya
        </Button>
        <Button
          variant="outlined"
          startIcon={<Campaign />}
          size="large"
        >
          Kampanya Şablonları
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Campaign color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {campaigns.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Kampanya
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
                <Campaign color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {campaigns.filter(c => c.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aktif Kampanya
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
                <Campaign color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    ₺{campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Bütçe
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
                <Campaign color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    ₺{campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Harcanan Bütçe
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Campaigns Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Kampanya Listesi
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kampanya</TableCell>
                  <TableCell>Restoran</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>Zaman</TableCell>
                  <TableCell>Günler</TableCell>
                  <TableCell>Hedef Kitle</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Bütçe</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id} hover>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {campaign.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{campaign.restaurant}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {campaign.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {campaign.startTime} - {campaign.endTime}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {campaign.startDate} / {campaign.endDate}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getDaysText(campaign.daysOfWeek)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{campaign.targetAudience}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(campaign.status)}
                        label={getStatusText(campaign.status)}
                        color={getStatusColor(campaign.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          ₺{campaign.spent.toLocaleString()} / ₺{campaign.budget.toLocaleString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={getBudgetProgress(campaign.spent, campaign.budget)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleView(campaign)}
                          title="Görüntüle"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="secondary"
                          onClick={() => handleEdit(campaign)}
                          title="Düzenle"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(campaign)}
                          title="Sil"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Kampanya Detayları</DialogTitle>
        <DialogContent>
          {selectedCampaign && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedCampaign.title}</Typography>
              <Typography variant="body1" paragraph>{selectedCampaign.description}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Restoran</Typography>
                  <Typography variant="body1">{selectedCampaign.restaurant}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Durum</Typography>
                  <Chip
                    icon={getStatusIcon(selectedCampaign.status)}
                    label={getStatusText(selectedCampaign.status)}
                    color={getStatusColor(selectedCampaign.status)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Başlangıç</Typography>
                  <Typography variant="body1">{selectedCampaign.startDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Bitiş</Typography>
                  <Typography variant="body1">{selectedCampaign.endDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Saat</Typography>
                  <Typography variant="body1">{selectedCampaign.startTime} - {selectedCampaign.endTime}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Günler</Typography>
                  <Typography variant="body1">{getDaysText(selectedCampaign.daysOfWeek)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Hedef Kitle</Typography>
                  <Typography variant="body1">{selectedCampaign.targetAudience}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Bütçe</Typography>
                  <Typography variant="body1">₺{selectedCampaign.budget.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Kapat</Button>
          <Button 
            onClick={() => {
              setViewDialogOpen(false);
              handleEdit(selectedCampaign);
            }}
            variant="contained"
          >
            Düzenle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kampanya Başlığı"
                defaultValue={selectedCampaign?.title || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                defaultValue={selectedCampaign?.description || ''}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Başlangıç Tarihi"
                type="date"
                defaultValue={selectedCampaign?.startDate || ''}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Bitiş Tarihi"
                type="date"
                defaultValue={selectedCampaign?.endDate || ''}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Başlangıç Saati"
                type="time"
                defaultValue={selectedCampaign?.startTime || ''}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Bitiş Saati"
                type="time"
                defaultValue={selectedCampaign?.endTime || ''}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hedef Kitle"
                defaultValue={selectedCampaign?.targetAudience || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Bütçe"
                type="number"
                defaultValue={selectedCampaign?.budget || ''}
                variant="outlined"
              />
            </Grid>
            {selectedCampaign && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Durum</InputLabel>
                  <Select
                    defaultValue={selectedCampaign.status}
                    label="Durum"
                    onChange={(e) => handleStatusChange(selectedCampaign.id, e.target.value)}
                  >
                    <MenuItem value="draft">Taslak</MenuItem>
                    <MenuItem value="active">Aktif</MenuItem>
                    <MenuItem value="paused">Duraklatıldı</MenuItem>
                    <MenuItem value="completed">Tamamlandı</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={() => {
              // Burada form verilerini toplayıp kaydetme işlemi yapılacak
              setEditDialogOpen(false);
            }}
            variant="contained"
          >
            {selectedCampaign ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Kampanya Sil</DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedCampaign?.title}" kampanyasını silmek istediğinizden emin misiniz? 
            Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Campaigns; 