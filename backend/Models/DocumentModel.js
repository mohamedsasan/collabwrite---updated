const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  _id: {
    type: String, // string ID
    required: true,
    unique: true,
  },
  title: {
    type: String,
    default: "Untitled Document",
  },
  content: {
    type: Object, // store Quill delta as object
    default: { ops: [{ insert: "" }] },
  },
  userId: {
    type: String,
    default: "anonymous", // ✅ Add default
  },
  filePath: {
    type: String, // path to saved HTML file
  },
  roomId: {
    type: String,
    unique: true, // for collaboration rooms
    default: null,
  },
}, { 
  timestamps: true 

}); // automatically creates createdAt & updatedAt

const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);

module.exports = Document;
