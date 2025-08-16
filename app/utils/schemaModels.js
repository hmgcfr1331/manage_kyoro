import mongoose from "mongoose"

const Schema = mongoose.Schema

const  ItemSchema = new Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    email: String,
})

const  RecordSchema = new Schema({
    registerDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    date: {
        type: Date,
        required: true
    },
    waterIntake: {
        type: Number,
        required: true
    },
    increaseOrDecrease: {
        type: Number,
        required: true
    },
    remark: {
        type: String,
        default: ""
    },
    user: {
        type: String,
        required: true,
    }
})

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

export const ItemModel = mongoose.models.Item || mongoose.model("Item", ItemSchema)
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)
export const RecordModel = mongoose.models.Record || mongoose.model("Record", RecordSchema)