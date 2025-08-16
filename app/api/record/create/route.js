import { NextResponse } from "next/server"
import connectDB from "../../../utils/database"
import { RecordModel } from "../../../utils/schemaModels"

export async function POST(request){
    const reqBody = await request.json()
    try{
        await connectDB()
        await RecordModel.create(reqBody)
        return NextResponse.json({message: "記録作成成功"})
    }catch{
        return NextResponse.json({message: "記録作成失敗"})
    }
}