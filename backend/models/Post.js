import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover: {type:String, default:'https://docs.appthemes.com/files/2017/03/vantage-4-default-blog-cover-photo.jpeg'},
    author:{type:Schema.Types.ObjectId, ref:'User'}
  },
  { timestamps: true }
);

const PostModel = mongoose.model('Post', PostSchema)

export default PostModel