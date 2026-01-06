import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Mumbai"
  tier: { type: String, enum: ['Tier-1', 'Tier-2', 'Tier-3'], required: true },
  avgRent: { type: Number, required: true }, // e.g., 15000
  avgFood: { type: Number, required: true }, // e.g., 5000
  transport: { type: Number, default: 2000 }
});

const City = mongoose.model("City", citySchema);
export default City;