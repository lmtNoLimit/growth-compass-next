import mongoose, { Schema, model, models } from "mongoose";

// User Model
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model("User", UserSchema);

// Assessment Model
const AssessmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  scores: { type: Map, of: Number, required: true }, // flexible category:score map
});

// Add compound index for faster queries by user
AssessmentSchema.index({ userId: 1, date: -1 });

export const Assessment = models.Assessment || model("Assessment", AssessmentSchema);

// Category Model (User Preferences)
const CategorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  categories: { type: [String], default: ["Coding", "Design", "Communication", "Leadership", "Problem Solving"] },
});

export const Category = models.Category || model("Category", CategorySchema);
