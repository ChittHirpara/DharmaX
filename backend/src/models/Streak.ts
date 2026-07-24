import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStreak extends Document {
  userId: mongoose.Types.ObjectId;
  currentStreak: number;
  lastCheckIn: Date;
  history: string[];
}

const StreakSchema = new Schema<IStreak>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  lastCheckIn: { type: Date },
  history: [{ type: String }]
});

export const Streak: Model<IStreak> = mongoose.models.Streak || mongoose.model<IStreak>('Streak', StreakSchema);
