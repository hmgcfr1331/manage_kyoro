import { NextResponse } from "next/server"
import connectDB from "../../../utils/database"
import { UserModel } from "../../../utils/schemaModels"

export async function POST(request){
    const reqBody = await request.json()
    try {
        await connectDB()
        await UserModel.create(reqBody)
        return NextResponse.json({message: "ユーザー登録成功"})
    }catch(error){
        console.error("User registration error:", error)
        return NextResponse.json({message: "ユーザー登録失敗"})
    }
    

}