const Document = require("../Models/DocumentModel");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Ensure uploads/documents directory exists
const documentsDir = path.join(__dirname, "../uploads/documents");
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Save or update a document
// Save or update a document
exports.saveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, userId } = req.body;
    console.log('📝 Saving document:', { id, title, userId });

    if (!id) {
      console.error('❌ Document ID is required');
      return res.status(400).json({ 
        status: "error", 
        message: "Document ID is required" 
      });
    }

    // ✅ Save content as Quill Delta format (Object) in MongoDB
    const docData = {
      title: title || "Untitled Document",
      content: content, // Keep as Quill delta object
      userId: userId || "anonymous",
      updatedAt: new Date()
    };

    // Convert to HTML for file storage only
    let htmlContent = '';
    if (content && content.ops) {
      htmlContent = content.ops
        .map(op => {
          if (typeof op.insert === 'string') {
            return op.insert.replace(/\n/g, '<br>');
          }
          return '';
        })
        .join('');
    }
    console.log('📄 HTML content length:', htmlContent.length);

    // Save to file system (for backup/export)
    const fileName = `${id}.html`;
    const filePath = path.join(documentsDir, fileName);
    console.log('💾 Saving to file:', filePath);
    
    try {
      fs.writeFileSync(filePath, htmlContent, 'utf8');
      console.log('✅ File saved successfully');
      docData.filePath = `/uploads/documents/${fileName}`;
    } catch (fileErr) {
      console.error('⚠️ File save warning:', fileErr.message);
      // Continue even if file save fails
    }

    // ✅ Save to MongoDB with Quill Delta format
    console.log('💾 Saving to MongoDB...');
    const doc = await Document.findOneAndUpdate(
      { _id: id },
      {
        ...docData,
        roomId: id, // use document ID as room ID for collaboration
      },
      { 
        new: true, 
        upsert: true, // create if not exist
        runValidators: true 
      }
    );
    console.log('✅ Document saved to MongoDB:', doc._id);

    res.json({ 
      status: "ok", 
      message: "Document saved successfully",
      data: doc 
    });
  } catch (err) {
    console.error('❌ Error in saveDocument:', err);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to save document", 
      error: err.message 
    });
  }
};

// Create new document (Save As)
exports.createDocument = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const newId = uuidv4();
    console.log('Creating new document:', { title, userId, newId });

    // Convert Quill delta to HTML for file storage
    const htmlContent = content && content.ops ?
      content.ops.map(op => op.insert || '').join('').replace(/\n/g, '<br>') :
      '';
    console.log('HTML content length for new doc:', htmlContent.length);

    // Save to file system
    const fileName = `${newId}.html`;
    const filePath = path.join(documentsDir, fileName);
    console.log('Saving new file:', filePath);
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log('New file saved successfully');

    // Save to database
    console.log('Saving new document to database...');
    const newDoc = new Document({
      _id: newId,
      title: title || "Untitled Document",
      content,
      userId,
      filePath: `/uploads/documents/${fileName}`,
      roomId: newId // use document ID as room ID for collaboration
    });

    await newDoc.save();
    console.log('New document saved to DB:', newDoc._id);

    res.json({ status: "ok", data: newDoc });
  } catch (err) {
    console.error('Error in createDocument:', err);
    res.status(500).json({ status: "error", message: "Server error", error: err.message });
  }
};

// Get recent documents (last 10)
exports.getRecentDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ updatedAt: -1 }).limit(10);
    res.json({ status: "ok", data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error", error: err.message });
  }
  };

// /

exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Requested document ID:", id);

    // ✅ use findOne because _id is a string (UUID)
    const doc = await Document.findOne({ _id: id });

    if (!doc) {
      return res.status(404).json({ status: "error", message: "Document not found" });
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


// Get document by ID
// exports.getDocumentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log('📖 Backend: Fetching document:', id);
    
//     const doc = await Document.findById(id);

//     if (!doc) {
//       console.log('⚠️ Backend: Document not found:', id);
//       // Return empty document structure
//       return res.json({
//         status: "ok",
//         data: {
//           _id: id,
//           title: "Untitled Document",
//           content: { ops: [{ insert: '' }] },
//           userId: null,
//           filePath: null,
//           roomId: id,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         }
//       });
//     }

//     console.log('✅ Backend: Document found');
//     console.log('   - Title:', doc.title);
//     console.log('   - Content type:', typeof doc.content);
//     console.log('   - Content has ops:', !!doc.content?.ops);
    
//     // Ensure content is in proper Quill format
//     let contentToReturn = doc.content;
//     if (!doc.content || !doc.content.ops) {
//       console.log('⚠️ Backend: Content not in Quill format, fixing...');
//       contentToReturn = { ops: [{ insert: '' }] };
//     }

//     const response = {
//       status: "ok",
//       data: {
//         _id: doc._id,
//         title: doc.title,
//         content: contentToReturn,
//         userId: doc.userId,
//         filePath: doc.filePath,
//         roomId: doc.roomId,
//         createdAt: doc.createdAt,
//         updatedAt: doc.updatedAt
//       }
//     };
    
//     console.log('✅ Backend: Sending response with content ops:', response.data.content.ops?.length);
//     res.json(response);
    
//   } catch (err) {
//     console.error('❌ Backend: Error fetching document:', err);
//     res.status(500).json({ 
//       status: "error", 
//       message: "Server error", 
//       error: err.message 
//     });
//   }
// };








// Rename document
exports.renameDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ status: "error", message: "Title is required" });
    }

    console.log('Renaming document:', { id, title });

    const doc = await Document.findOneAndUpdate(
      { _id: id },
      { title: title.trim(), updatedAt: new Date() },
      { new: true }
    );

    if (!doc) {
      console.log('Document not found for rename:', id);
      return res.status(404).json({ status: "error", message: "Document not found" });
    }

    console.log('Document renamed successfully:', doc._id, doc.title);
    res.json({ status: "ok", data: doc });
  } catch (err) {
    console.error('Error in renameDocument:', err);
    res.status(500).json({ status: "error", message: "Server error", error: err.message });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the document first to get the file path
    const doc = await Document.findOne({ _id: id });
    if (!doc) {
      return res.status(404).json({ status: "error", message: "Document not found" });
    }

    // Delete the file from filesystem if it exists
    if (doc.filePath) {
      const filePath = path.join(__dirname, "../", doc.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File deleted:', filePath);
      }
    }

    // Delete from database
    await Document.findOneAndDelete({ _id: id });

    res.json({ status: "ok", message: "Document deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error", error: err.message });
  }
};
