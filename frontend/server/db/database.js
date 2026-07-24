const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// --- Schemas ---

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping UUID for compatibility
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  username: { type: String },
  bot_name: { type: String, default: 'Noerax Guide' },
  bookmarks: { type: [String], default: [] },
  reading_progress: { type: Object, default: {} },
  streak_count: { type: Number, default: 1 },
  last_checkin_date: { type: String, default: '' },
  saved_journals: [{
    id: { type: String },
    entry: { type: String },
    insights: { type: String },
    quote: { type: String },
    action_steps: [String],
    tone: { type: String },
    created_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping UUID
  user_id: { type: String, required: true, ref: 'User' },
  persona_id: { type: String, required: true },
  title: { type: String },
  bot_name: { type: String, default: 'Companion' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping UUID
  conversation_id: { type: String, required: true, ref: 'Conversation' },
  sender: { type: String, required: true }, // 'user', 'assistant', 'system'
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const userMemorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping UUID
  user_id: { type: String, required: true, ref: 'User' },
  memory_text: { type: String, required: true },
  category: { type: String, required: true }, // 'struggle', 'preference', 'value', 'fact', etc.
  created_at: { type: Date, default: Date.now }
});

const wisdomTextSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping UUID
  book_name: { type: String, required: true },
  chapter: { type: String },
  verse: { type: String },
  content: { type: String, required: true }
});

// --- Models ---

const User = mongoose.model('User', userSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
const UserMemory = mongoose.model('UserMemory', userMemorySchema);
const WisdomText = mongoose.model('WisdomText', wisdomTextSchema);

let isConnected = false;

async function getDatabase() {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sattva';

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('✓ MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}

module.exports = {
  getDatabase,
  User,
  Conversation,
  Message,
  UserMemory,
  WisdomText
};
