import { NextResponse } from "next/server"
import connectDB from "../../../../utils/database"
import { RecordModel } from "../../../../utils/schemaModels"

export async function GET(request, context){
    try {
        await connectDB()
        const singleItem = await RecordModel.findById(context.params.id)
        return NextResponse.json({message: "記録読み取り成功（シングル）", singleItem: singleItem})
    }catch{
        return NextResponse.json({message: "記録読み取り失敗（シングル）"})
    }
    

}