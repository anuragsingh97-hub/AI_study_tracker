import mongoose from "mongoose"
const goalSchema=new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

title:String,

description:String,

subject:String,

priority:{
type:String,
enum:["Low","Medium","High"],
default:"Medium"
},

deadline:Date,

status:{
type:String,
enum:["Not Started","In Progress","Completed"],
default:"Not Started"
},

progress:{
type:Number,
default:0
}

},{timestamps:true});

export default mongoose.model("Goal",goalSchema);