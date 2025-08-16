import { NextResponse } from "next/server"
import connectDB from "../../../utils/database"
import { RecordModel } from "../../../utils/schemaModels"

export async function GET(){
    try {
        await connectDB()
        const allItems = await RecordModel.find()
        return NextResponse.json({message: "記録読み取り成功", allItems: allItems})
    }catch{
        return NextResponse.json({message: "記録読み取り失敗"})
    }
}

export const revalidate = 0