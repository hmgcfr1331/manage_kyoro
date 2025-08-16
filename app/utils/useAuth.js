import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtVerify } from "jose"

const useAuth = () => {
    const [loginUser, setLoginUser] = useState("")
    const router = useRouter()

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/user/login")
            }
            try{
                const secretKey = new TextEncoder().encode("manage-kyoro")
                const decodeJwt = await jwtVerify(token, secretKey)
                setLoginUser(decodeJwt.payload.userName)
            }catch{
                router.push("/user/login")
            }
        }
        checkToken()
    }, [router])

    return loginUser
}

export default useAuth