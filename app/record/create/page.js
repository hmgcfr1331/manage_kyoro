"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useAuth from "../../utils/useAuth"
import { 
    Container,
    Box,
    TextField,
    Button,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Paper,
    FormHelperText
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const CreateItem = () => {
    const [date, setDate] = useState("")
    const [waterIntake, setWaterIntake] = useState("")
    const [increaseOrDecrease, setIncreaseOrDecrease] = useState("increase")
    const [remark, setRemark] = useState("")
    const [waterIntakeError, setWaterIntakeError] = useState("")
    const [remarkError, setRemarkError] = useState("")

    const paperStyle = {
        boxShadow: 'none',
        border: 'none'
    }

    const router = useRouter()
    const loginUser = useAuth()

    useEffect(() => {
        // 初期日付を設定
        if (!date) {
            const today = new Date().toISOString().split('T')[0]
            setDate(today)
        }
    }, [])

    const validateWaterIntake = (value) => {
        const waterIntakeNum = Number(value)
        if (waterIntakeNum < 1 || waterIntakeNum > 200) {
            setWaterIntakeError("水分量は1から200の間で入力してください")
            return false
        } else {
            setWaterIntakeError("")
            return true
        }
    }

    const validateRemark = (value) => {
        if (value.length > 60) {
            setRemarkError("備考は60文字以内で入力してください")
            return false
        } else {
            setRemarkError("")
            return true
        }
    }

    const validateForm = () => {
        const isWaterIntakeValid = validateWaterIntake(waterIntake)
        const isRemarkValid = validateRemark(remark)
        return isWaterIntakeValid && isRemarkValid
    }

    const resetForm = () => {
        setWaterIntake("")
        setRemark("")
        setIncreaseOrDecrease("increase")
        // 日付は保持
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        try{
            const finalWaterIntake = increaseOrDecrease === "decrease" ? -waterIntake : waterIntake
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/record/create`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    date: date,
                    increaseOrDecrease: increaseOrDecrease === "increase" ? 1 : -1,
                    waterIntake: finalWaterIntake,
                    remark: remark,
                    user: loginUser
                })
            })
            const jsonData = await response.json()
            // alert(jsonData.message)
            resetForm()
            router.refresh()
        }catch{
            alert("記録作成失敗")
        }
    }

    if(loginUser){
        return ( 
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4, ...paperStyle }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        記録作成
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            margin="normal"
                            required
                            label="日付"
                            InputLabelProps={{ shrink: true }}
                        />
                        
                        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="subtitle1" gutterBottom>
                                増減
                            </Typography>
                            <ToggleButtonGroup
                                value={increaseOrDecrease}
                                exclusive
                                onChange={(e, newValue) => {
                                    if (newValue !== null) {
                                        setIncreaseOrDecrease(newValue);
                                    }
                                }}
                                sx={{ mb: 2 }}
                            >
                                <ToggleButton value="increase" aria-label="増加">
                                    <AddIcon /> 増加
                                </ToggleButton>
                                <ToggleButton value="decrease" aria-label="減少">
                                    <RemoveIcon /> 減少
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <TextField
                            fullWidth
                            type="number"
                            value={waterIntake}
                            onChange={(e) => {
                                const newValue = e.target.value
                                setWaterIntake(newValue)
                                validateWaterIntake(newValue)
                            }}
                            margin="normal"
                            required
                            label="水分量 (ml)"
                            error={!!waterIntakeError}
                            InputProps={{
                                inputProps: { min: 1, max: 200 }
                            }}
                        />
                        {waterIntakeError && (
                            <FormHelperText error>{waterIntakeError}</FormHelperText>
                        )}
                        
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={remark}
                            onChange={(e) => {
                                const newValue = e.target.value
                                setRemark(newValue)
                                validateRemark(newValue)
                            }}
                            margin="normal"
                            label="備考"
                            error={!!remarkError}
                        />
                        {remarkError && (
                            <FormHelperText error>{remarkError}</FormHelperText>
                        )}
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            作成
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
        )
    }
}

export default CreateItem