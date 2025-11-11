import axios from "axios";

const API_URL = "http://localhost:5000/api/documents";

// Add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================== Create a new document ==================
export const createDocument = async (data) => {
  try {
    const res = await axios.post(`${API_URL}`, data); // create new document
    return res;
  } catch (err) {
    console.error("Failed to create document:", err);
    throw err;
  }
};

// ================== Save or update a document ==================
export const saveDocument = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res;
  } catch (err) {
    console.error("Failed to save document:", err);
    throw err;
  }
};

// ================== Fetch all recent documents ==================
export const fetchRecentDocuments = async () => {
  try {
    const res = await axios.get(`${API_URL}`);
    return res;
  } catch (err) {
    console.error("Failed to fetch recent documents:", err);
    throw err;
  }
};

// // ================== Fetch single document by ID ==================
// export const fetchDocumentById = async (id) => {
//   try {
//     const res = await axios.get(`${API_URL}/${id}`);
//     return res;
//   } catch (err) {
//     console.error(`Failed to fetch document ${id}:`, err);
//     throw err;
//   }
// };
// ================== Fetch single document by ID ==================
export const fetchDocumentById = async (id) => {
  try {
    console.log("🌐 documentAPI: Fetching document ID:", id);
    const res = await axios.get(`${API_URL}/${id}`);
    console.log("🌐 documentAPI: Response received:", res);
    return res;
  } catch (err) {
    console.error(`🌐 documentAPI: Failed to fetch document ${id}:`, err);
    throw err;
  }
};




// ================== Rename document ==================
export const renameDocument = async (id, title) => {
  try {
    const res = await axios.put(`${API_URL}/${id}/rename`, { title });
    return res;
  } catch (err) {
    console.error(`Failed to rename document ${id}:`, err);
    throw err;
  }
};

// ================== Delete document ==================
export const deleteDocument = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res;
  } catch (err) {
    console.error(`Failed to delete document ${id}:`, err);
    throw err;
  }
};
