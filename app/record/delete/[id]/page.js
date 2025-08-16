"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import useAuth from "../../../utils/useAuth"
import { Typography, Box, Button, Paper, Stack } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

const DeleteItem = (context) => {
    const [date, setDate] = useState("")
    const [waterIntake, setWaterIntake] = useState("")
    const [remark, setRemark] = useState("")
    const [user, setUser] = useState("")
    const [registerDate, setRegisterDate] = useState("")

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
            alert(jsonData.message)
            router.push("/")
            router.refresh()
        }catch{
            alert("記録削除失敗")
        }
    }

    // if(loginUser === user){
        return ( 
        <div>
            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', my: 4 }}>
                記録の詳細
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: 'background.paper'
                }}
            >
                <Stack spacing={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>日付</Typography>
                        <Typography>{date.substring(0, 10)}</Typography>
                    </Paper>
                    
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>水分摂取量</Typography>
                        <Typography>{waterIntake}ml</Typography>
                    </Paper>
                    
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>備考</Typography>
                        <Typography>{remark}</Typography>
                    </Paper>
                    
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>登録ユーザー</Typography>
                        <Typography>{user}</Typography>
                    </Paper>
                    
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>登録日</Typography>
                        <Typography>{registerDate.substring(0, 10)}</Typography>
                    </Paper>
                    
                    <Button 
                        type="submit"
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<DeleteIcon />}
                        sx={{ mt: 2 }}
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