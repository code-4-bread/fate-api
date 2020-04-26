import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const SessionSchema = new Schema({
  title: String,
  sessionId: String,
  sessionOwnerId: String,
  participants: [{
    name: String,
    userId: String,
    isOwner: Boolean,
    connected: Boolean,
  }],
  votes: [{
    voter: String,
    votePoint: Number,
  }],
  notes: [String],
});

export default Mongoose.model('Session', SessionSchema, 'session');
