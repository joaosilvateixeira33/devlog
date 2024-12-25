const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    comments: [
      {
        username: String,
        content: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
});

module.exports = mongoose.model('Post', PostSchema);