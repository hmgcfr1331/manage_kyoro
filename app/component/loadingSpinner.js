'use client'
import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Box
        component="img"
        src="/kyoro.jpg"
        sx={{
          width: 200,
          height: 200,
          mb: 3,
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}
      />
      <Typography variant="h6" color="textSecondary">
        データを読み込み中...
      </Typography>
    </Box>
  )
}

export default LoadingSpinner
