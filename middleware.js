import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request){
    const token = await request.headers.get("Authorization")?.split(" ")[1]
    //const token = "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRhcm9AZ21haWwuY29tIiwiZXhwIjoxNzU0OTc4MDMyfQ.DgBCDKxdU55xGx3LMtjNoO7yRhs39YzPBBkUOMKhWpU"
    if(!token){
        return NextResponse.json({message: "トークンがありません"})
    }
    try{
        const secretKey = new TextEncoder().encode("manage-kyoro")
        const decodeJwt = await jwtVerify(token, secretKey)
        return NextResponse.next()
    }catch{
        return NextResponse.json({message: "トークンが正しくないので、ログインしてください"})
    }
}
export const config = {
    matcher: ["/api/record/create", "/api/record/delete/:path*"],
}