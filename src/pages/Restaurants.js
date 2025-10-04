import React from 'react';
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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Restaurant,
} from '@mui/icons-material';

function Restaurants() {
  // Mock data - gerçek projede API'den gelecek
  const restaurants = [
    {
      id: 1,
      name: 'Kahve Dünyası',
      type: 'cafe',
      address: {
        city: 'İstanbul',
        district: 'Kadıköy',
        street: 'Bağdat Caddesi No:123',
      },
      contact: {
        phone: '+90 216 123 45 67',
        email: 'info@kahvedunyasi.com',
      },
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Lezzet Durağı',
      type: 'restaurant',
      address: {
        city: 'İstanbul',
        district: 'Beşiktaş',
        street: 'Sahil Caddesi No:45',
      },
      contact: {
        phone: '+90 212 987 65 43',
        email: 'info@lezzetduragi.com',
      },
      isActive: true,
      createdAt: '2024-01-10',
    },
    {
      id: 3,
      name: 'Güzel Kahve',
      type: 'cafe',
      address: {
        city: 'İstanbul',
        district: 'Şişli',
        street: 'Maçka Caddesi No:78',
      },
      contact: {
        phone: '+90 212 456 78 90',
        email: 'info@guzelkahve.com',
      },
      isActive: false,
      createdAt: '2024-01-05',
    },
  ];

  const getTypeText = (type) => {
    const types = {
      restaurant: 'Restoran',
      cafe: 'Kafe',
      bar: 'Bar',
      'fast-food': 'Fast Food',
      other: 'Diğer',
    };
    return types[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      restaurant: 'primary',
      cafe: 'secondary',
      bar: 'warning',
      'fast-food': 'info',
      other: 'default',
    };
    return colors[type] || 'default';
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Aktif' : 'Pasif';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Restoranlar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            İşletme profillerini yönetin ve kampanya oluşturun.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          Yeni Restoran Ekle
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Restaurant color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {restaurants.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Restoran
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
                <Restaurant color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {restaurants.filter(r => r.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aktif Restoran
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
                <Restaurant color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {restaurants.filter(r => r.type === 'cafe').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kafe Sayısı
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
                <Restaurant color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {restaurants.filter(r => r.type === 'restaurant').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Restoran Sayısı
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Restaurants Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Restoran Listesi
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>İsim</TableCell>
                  <TableCell>Tür</TableCell>
                  <TableCell>Şehir</TableCell>
                  <TableCell>İlçe</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Kayıt Tarihi</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id} hover>
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {restaurant.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeText(restaurant.type)}
                        color={getTypeColor(restaurant.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{restaurant.address.city}</TableCell>
                    <TableCell>{restaurant.address.district}</TableCell>
                    <TableCell>{restaurant.contact.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(restaurant.isActive)}
                        color={getStatusColor(restaurant.isActive)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{restaurant.createdAt}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
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
    </Box>
  );
}

export default Restaurants; 