"use client"
import { Alert } from '@mui/material'

const SuccessAlert = ({ message }) => {
    return (
        <>
            {message && (
                <Alert 
                    severity="success" 
                    sx={{ 
                        position: 'fixed',
                        top: 60,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1300,
                        width: 'calc(100% - 40px)',
                        maxWidth: '600px'
                    }}
                >
                    {message}
                </Alert>
            )}
        </>
    )
}

export default SuccessAlert
