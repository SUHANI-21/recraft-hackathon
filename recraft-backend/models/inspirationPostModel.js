import mongoose from 'mongoose';

const inspirationPostSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the User model
    },
    title: {
      type: String,
      required: true,
    },
    photos: {
      type: [String], // An array of strings (image paths)
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    materialsUsed: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    // We can add photos, tags, etc. later
  },
  {
    timestamps: true,
  }
);

const InspirationPost = mongoose.model('InspirationPost', inspirationPostSchema);

export default InspirationPost;