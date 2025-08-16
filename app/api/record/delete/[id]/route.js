import { NextResponse } from "next/server"
import connectDB from "../../../../utils/database"
import { RecordModel } from "../../../../utils/schemaModels"

export async function DELETE(request, context){
    const reqBody = await request.json()
    try {
        await connectDB()
        const singleItem = await RecordModel.findById(context.params.id)
        if(singleItem.email === reqBody.email){
            await RecordModel.deleteOne({_id: context.params.id}, reqBody)
            return NextResponse.json({message: "記録削除成功"})
        }else{
            return NextResponse.json({message: "他の人が作成した記録です"})
        }
    }catch{
        return NextResponse.json({message: "記録削除失敗"})
    }
    

}