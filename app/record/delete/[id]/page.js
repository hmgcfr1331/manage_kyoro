"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import useAuth from "../../../utils/useAuth"
import SuccessAlert from "../../../component/successAlert"
import { Typography, Box, Button, Paper, Stack } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

const DeleteItem = (context) => {
    const [date, setDate] = useState("")
    const [waterIntake, setWaterIntake] = useState("")
    const [remark, setRemark] = useState("")
    const [user, setUser] = useState("")
    const [registerDate, setRegisterDate] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const router = useRouter()
    const loginUser = useAuth()

    useEffect(() => {
        const getSingleItem = async(id) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/record/readsingle/${id}`, {cashe: "no-store"})
            const jsonData = await response.json()
            const singleItem = jsonData.singleItem
            setDate(singleItem.date)
            setWaterIntake(singleItem.waterIntake) 
            setRemark(singleItem.remark)
            setUser(singleItem.user)
            setRegisterDate(singleItem.registerDate)
        }
        getSingleItem(context.params.id)
    }, [context])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/record/delete/${context.params.id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    user: user
                })
            })
            const jsonData = await response.json()
            setSuccessMessage("記録を削除しました")
            setTimeout(() => {
                setSuccessMessage("")
                router.push("/")
                router.refresh()
            }, 3000)
        }catch{
            alert("記録削除失敗")
        }
    }

    // if(loginUser === user){
        return ( 
        <div>
            <SuccessAlert message={successMessage} />
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                    textAlign: 'center', 
                    color: 'primary.main', 
                    my: 4,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}
            >
                記録の詳細
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    p: { xs: 1.5, sm: 2, md: 3 },
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: 'background.paper'
                }}
            >
                <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }}>日付</Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>{date.substring(0, 10)}</Typography>
                    </Paper>
                    
                    <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }}>水分摂取量</Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>{waterIntake}ml</Typography>
                    </Paper>
                    
                    <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }}>備考</Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>{remark}</Typography>
                    </Paper>
                    
                    <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }}>登録ユーザー</Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>{user}</Typography>
                    </Paper>
                    
                    <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }}>登録日</Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>{registerDate.substring(0, 10)}</Typography>
                    </Paper>
                    
                    <Button 
                        type="submit"
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<DeleteIcon />}
                        sx={{ 
                            mt: 2,
                            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
                            padding: { xs: '0.5rem 1rem', sm: '0.75rem 1.5rem', md: '1rem 2rem' }
                        }}
                    >
                        削除する
                    </Button>
                </Stack>
            </Box>
        </div>
        )
    // }else{
    //     return <h1>権限がありません</h1>
    // }
}

export default DeleteItem