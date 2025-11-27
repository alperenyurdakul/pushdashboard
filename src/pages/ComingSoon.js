import React from 'react';
import { Box, Typography, Container, Paper, CircularProgress } from '@mui/material';
import { Construction } from '@mui/icons-material';

export default function ComingSoon() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translate(0, 0)',
            },
            '50%': {
              transform: 'translate(30px, 30px)',
            },
          },
        }}
      />
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Animated Icon */}
          <Box 
            sx={{ 
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
              }}
            >
              <CircularProgress
                variant="indeterminate"
                size={120}
                thickness={2}
                sx={{
                  color: '#667eea',
                  position: 'absolute',
                  animation: 'spin 2s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Construction
                  sx={{
                    fontSize: 48,
                    color: 'white',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Bakım Modu
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ 
              mb: 5,
              fontWeight: 500,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
            }}
          >
            Çok Yakında Sizlerle!
          </Typography>

          {/* Footer Note */}
          <Box
            sx={{
              pt: 4,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Sorularınız için bizimle iletişime geçin
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#667eea',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              appfaydana@gmail.com
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
