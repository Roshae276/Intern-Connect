import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    bio: String,
    skills: [String],
    resumeName: String,
    resumeFile: String, // This will store the Cloudinary PDF URL
    avatar: String,     // This will store the Cloudinary Image URL
    location: String,
    mobile: String,
    whatsapp: String,
    linkedin: String,
    github: String
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;