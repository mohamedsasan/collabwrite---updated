const express = require("express");
const router = express.Router();
const Document = require("../Models/DocumentModel");
const auth = require("../Middleware/auth");
const { saveDocument, createDocument, getRecentDocuments, getDocumentById, renameDocument, deleteDocument } = require("../Controllers/DocumentController");

// Get all documents (for recent docs)
router.get("/", auth, getRecentDocuments);

// Get a single document by ID
router.get("/:id", auth, getDocumentById);

// Update document content (save)
router.put("/:id", auth, saveDocument);

// Create new document
router.post("/", auth, createDocument);

// Rename document
router.put("/:id/rename", auth, renameDocument);

// Delete document
router.delete("/:id", auth, deleteDocument);

module.exports = router;
