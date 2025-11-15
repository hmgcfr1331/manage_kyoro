"use client"
import { useEffect, useState } from 'react'
import { Alert } from '@mui/material'

const ErrorAlert = ({ message, onClose }) => {
    const [displayMessage, setDisplayMessage] = useState(message)

    useEffect(() => {
        if (message) {
            setDisplayMessage(message)
            const timer = setTimeout(() => {
                setDisplayMessage('')
                if (onClose) onClose()
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [message, onClose])

    return (
        <>
            {displayMessage && (
                <Alert 
                    severity="error" 
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
                    {displayMessage}
                </Alert>
            )}
        </>
    )
}

export default ErrorAlert
