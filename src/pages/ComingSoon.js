import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Construction, Schedule } from '@mui/icons-material';

export default function ComingSoon() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #28A745 0%, #1E7E34 100%)',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Icon */}
          <Box sx={{ mb: 3 }}>
            <Construction
              sx={{
                fontSize: 120,
                color: '#28A745',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(135deg, #28A745 0%, #1E7E34 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Çok Yakında
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            color="textSecondary"
            sx={{ mb: 3 }}
          >
            Dashboard Panelimiz Çok Yakında Sizlerle!
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 4, lineHeight: 1.8 }}
          >
            Marka panelimiz üzerinde çalışıyoruz. Kısa süre içinde 
            kampanyalarınızı yönetebileceğiniz, analiz yapabileceğiniz ve 
            müşterilerinize ulaşabileceğiniz güçlü bir platform ile 
            karşınızda olacağız.
          </Typography>

          {/* Features */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 48, color: '#28A745', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Kampanya Yönetimi
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 48, color: '#28A745', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Analiz & İstatistik
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 48, color: '#28A745', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Müşteri İletişimi
              </Typography>
            </Box>
          </Box>

          {/* Footer Note */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 4, display: 'block' }}
          >
            Sorularınız için: appfaydana@gmail.com
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

