"use client"
import { useState } from "react"
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Avatar,
    Link,
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useRouter } from "next/navigation"

const Register = () => {
    const router = useRouter()
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            setPasswordError(true)
            return
        }
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/register`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userName: userName,
                    password: password
                })
            })
            const jsonData = await response.json()
            alert(jsonData.message)
            router.push("/user/login")
        } catch(error) {
            alert("登録失敗")
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <PersonAddIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        ユーザー登録
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="userName"
                            label="ユーザー名"
                            name="userName"
                            autoComplete="username"
                            autoFocus
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="パスワード"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError(false)
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="パスワード（確認）"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                setPasswordError(false)
                            }}
                            error={passwordError}
                            helperText={passwordError ? "パスワードが一致しません" : ""}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            登録
                        </Button>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link href="/user/login" variant="body2">
                                既にアカウントをお持ちの方はこちら
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default Register