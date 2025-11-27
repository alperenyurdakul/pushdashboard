import React, { useState, useEffect } from 'react';
import API_CONFIG from '../config/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Avatar
} from '@mui/material';
import { Add, Delete, Visibility, Refresh, CloudUpload, Image, People, CheckCircle, Cancel } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';

const Events = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [openParticipantsDialog, setOpenParticipantsDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventTime: new Date(),
    location: '',
    organizer: '',
    options: ['Evet', 'Hayır'],
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/events/all-events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Etkinlik yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      
      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        alert('Sadece resim dosyaları yüklenebilir');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const handleCreateEvent = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('eventTime', formData.eventTime.toISOString());
      formDataToSend.append('location', formData.location);
      formDataToSend.append('organizer', formData.organizer);
      formDataToSend.append('options', JSON.stringify(formData.options));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/events/create-event`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        alert('Etkinlik başarıyla oluşturuldu!');
        setOpenCreateDialog(false);
        setFormData({
          title: '',
          description: '',
          eventTime: new Date(),
          location: '',
          organizer: '',
          options: ['Evet', 'Hayır'],
          image: null,
          imagePreview: null
        });
        loadEvents();
      } else {
        alert('Etkinlik oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Etkinlik oluşturma hatası:', error);
      alert('Etkinlik oluşturulurken hata oluştu');
    }
  };

  const handleViewResults = async (eventId) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/events/event-results/${eventId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedEvent(data.event);
        setOpenResultsDialog(true);
      }
    } catch (error) {
      console.error('Sonuçlar getirme hatası:', error);
    }
  };

  const handleViewParticipants = async (eventId) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/events/event/${eventId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedEvent(data.event);
        setOpenParticipantsDialog(true);
      }
    } catch (error) {
      console.error('Katılımcılar getirme hatası:', error);
    }
  };

  const handleApproveParticipant = async (participantId, approved) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/events/${selectedEvent._id}/participant/${participantId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ approved }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(approved ? 'Katılımcı onaylandı!' : 'Katılımcı reddedildi!');
        // Etkinliği yeniden yükle
        handleViewParticipants(selectedEvent._id);
      } else {
        alert('İşlem başarısız: ' + data.message);
      }
    } catch (error) {
      console.error('Katılımcı onay hatası:', error);
      alert('İşlem başarısız oldu!');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/events/event/${eventId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Etkinlik başarıyla silindi!');
        loadEvents();
      } else {
        alert('Etkinlik silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Etkinlik silme hatası:', error);
      alert('Etkinlik silinirken hata oluştu');
    }
  };

  const testOneSignal = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/events/test-onesignal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        alert('OneSignal test bildirimi gönderildi!');
      } else {
        alert(`OneSignal test hatası: ${result.message}`);
      }
    } catch (error) {
      console.error('OneSignal test hatası:', error);
      alert('OneSignal test hatası oluştu!');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('tr-TR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          🎉 Etkinlik Yönetimi - {currentUser?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {currentUser?.userType === 'brand' 
            ? 'Marka etkinliklerinizi oluşturun ve yönetin'
            : 'Kişisel etkinliklerinizi oluşturun ve yönetin'
          }
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadEvents}
            sx={{ mr: 2 }}
          >
            Yenile
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Yeni Etkinlik
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {event.image && (
                  <Box sx={{ height: 200, overflow: 'hidden' }}>
                    <img
                      src={`${API_CONFIG.BASE_URL}/uploads/${event.image}`}
                      alt={event.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                    <Chip
                      label={getStatusText(event.status)}
                      color={getStatusColor(event.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      📍 {event.location}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      ⏰ {formatDate(event.eventTime)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      👤 {event.organizer}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Seçenekler:
                    </Typography>
                    {event.options.map((option, index) => (
                      <Chip
                        key={index}
                        label={`${option.text} (${option.votes} oy)`}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                    Toplam Oy: {event.totalVotes}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewResults(event._id)}
                  >
                    Sonuçları Gör
                  </Button>
                  <Button
                    size="small"
                    startIcon={<People />}
                    onClick={() => handleViewParticipants(event._id)}
                    color="primary"
                  >
                    Katılımcılar
                    {event.participants && event.participants.length > 0 && (
                      <Chip 
                        label={event.participants.length} 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Etkinlik Oluşturma Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Etkinlik Oluştur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Etkinlik Başlığı"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Açıklama"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
              <DateTimePicker
                label="Etkinlik Tarihi"
                value={formData.eventTime}
                onChange={(newValue) => handleInputChange('eventTime', newValue)}
                sx={{ mb: 2, width: '100%' }}
              />
            </LocalizationProvider>
            
            <TextField
              fullWidth
              label="Konum"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Organizatör"
              value={formData.organizer}
              onChange={(e) => handleInputChange('organizer', e.target.value)}
              sx={{ mb: 2 }}
            />
            
            {/* Görsel Yükleme */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Etkinlik Görseli
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              {formData.imagePreview ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={formData.imagePreview}
                    sx={{ width: 100, height: 100 }}
                    variant="rounded"
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {formData.image.name}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={removeImage}
                      startIcon={<Delete />}
                    >
                      Kaldır
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover'
                    }
                  }}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Görsel yüklemek için tıklayın
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG, JPEG (Max 5MB)
                  </Typography>
                </Box>
              )}
              
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </Box>
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              Oylama Seçenekleri
            </Typography>
            
            {formData.options.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  label={`Seçenek ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  sx={{ mr: 2 }}
                />
                {formData.options.length > 2 && (
                  <IconButton onClick={() => removeOption(index)} color="error">
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addOption}
              sx={{ mt: 1 }}
            >
              Seçenek Ekle
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>İptal</Button>
          <Button onClick={testOneSignal} variant="outlined" color="secondary">
            OneSignal Test
          </Button>
          <Button onClick={handleCreateEvent} variant="contained">
            Etkinlik Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sonuçlar Dialog */}
      <Dialog open={openResultsDialog} onClose={() => setOpenResultsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Etkinlik Sonuçları</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedEvent.title}
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Seçenek</TableCell>
                      <TableCell align="center">Oy Sayısı</TableCell>
                      <TableCell align="center">Yüzde</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedEvent.options.map((option, index) => {
                      const percentage = selectedEvent.totalVotes > 0 
                        ? ((option.votes / selectedEvent.totalVotes) * 100).toFixed(1)
                        : 0;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>{option.text}</TableCell>
                          <TableCell align="center">{option.votes}</TableCell>
                          <TableCell align="center">{percentage}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Oy Verenler
              </Typography>
              
              {selectedEvent.options.map((option, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {option.text} ({option.votes} oy)
                  </Typography>
                  {option.voters.map((voter, voterIndex) => (
                    <Chip
                      key={voterIndex}
                      label={`${voter.userName} (${voter.phone})`}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResultsDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Katılımcılar Dialog */}
      <Dialog open={openParticipantsDialog} onClose={() => setOpenParticipantsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People />
            Etkinlik Katılımcıları
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedEvent.title}
              </Typography>
              
              {selectedEvent.participants && selectedEvent.participants.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Kullanıcı</TableCell>
                        <TableCell>Telefon</TableCell>
                        <TableCell>Katılım Tarihi</TableCell>
                        <TableCell align="center">Durum</TableCell>
                        <TableCell align="center">İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedEvent.participants.map((participant) => (
                        <TableRow key={participant._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {participant.userName?.charAt(0) || '?'}
                              </Avatar>
                              {participant.userName || 'Bilinmeyen'}
                            </Box>
                          </TableCell>
                          <TableCell>{participant.phone || '-'}</TableCell>
                          <TableCell>
                            {participant.joinedAt 
                              ? new Date(participant.joinedAt).toLocaleString('tr-TR')
                              : '-'
                            }
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={
                                participant.status === 'pending' ? 'Bekliyor' :
                                participant.status === 'approved' ? 'Onaylandı' :
                                participant.status === 'rejected' ? 'Reddedildi' :
                                'Bilinmiyor'
                              }
                              color={
                                participant.status === 'pending' ? 'warning' :
                                participant.status === 'approved' ? 'success' :
                                participant.status === 'rejected' ? 'error' :
                                'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {participant.status === 'pending' && (
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleApproveParticipant(participant._id, true)}
                                  title="Onayla"
                                >
                                  <CheckCircle />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleApproveParticipant(participant._id, false)}
                                  title="Reddet"
                                >
                                  <Cancel />
                                </IconButton>
                              </Box>
                            )}
                            {participant.status === 'approved' && (
                              <Typography variant="body2" color="success.main">
                                ✓ Onaylandı
                              </Typography>
                            )}
                            {participant.status === 'rejected' && (
                              <Typography variant="body2" color="error.main">
                                ✗ Reddedildi
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <People sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Henüz katılımcı yok
                  </Typography>
                </Box>
              )}

              {/* Özet Bilgiler */}
              {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    📊 Katılımcı İstatistikleri
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                    <Typography variant="body2">
                      Toplam: <strong>{selectedEvent.participants.length}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Bekleyen: <strong>{selectedEvent.participants.filter(p => p.status === 'pending').length}</strong>
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Onaylı: <strong>{selectedEvent.participants.filter(p => p.status === 'approved').length}</strong>
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Reddedilen: <strong>{selectedEvent.participants.filter(p => p.status === 'rejected').length}</strong>
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenParticipantsDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Events;
