import Link from "next/link"

const getSingleItem = async(id) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/record/readsingle/${id}`, {cashe: "no-store"})
    const jsonData = await response.json()
    const singleItem = jsonData.singleItem
    return singleItem
}

const ReadSingleItem = async(context) => {
    const singleItem = await getSingleItem(context.params.id)
    return (
        <div className="grid-container-in">
            <div>
                <h1>{singleItem.date}</h1>
                <h2>{singleItem.waterIntake}</h2>
                <h2>{singleItem.waterIntakeChange}</h2>
                <div>
                    <Link href={`/record/delete/${singleItem._id}`}>記録削除</Link>
                </div>
            </div>
        </div>
    )
}

export default ReadSingleItem