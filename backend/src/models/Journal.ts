import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJournal extends Document {
  userId: mongoose.Types.ObjectId;
  title?: string;
  entryText: string;
  insights?: string;
  wisdom?: string;
  actions?: string[];
  tone?: string;
  createdAt: Date;
}

const JournalSchema = new Schema<IJournal>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, trim: true },
  entryText: { type: String, required: true },
  insights: { type: String },
  wisdom: { type: String },
  actions: [{ type: String }],
  tone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Journal: Model<IJournal> = mongoose.models.Journal || mongoose.model<IJournal>('Journal', JournalSchema);
