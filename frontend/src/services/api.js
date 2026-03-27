// =====================================================
// API SERVICE - Simple HTTP Client
// =====================================================

// Import axios library for making HTTP requests
import axios from "axios";

// =====================================================
// Create API instance with base URL
// =====================================================
const API = axios.create({
    // Backend server URL
    baseURL: "http://localhost:5000/api"
});

// =====================================================
// Add request interceptor
// This runs before every API request
// =====================================================
API.interceptors.request.use(function(request) {
    // Get token from browser's localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the request header
    if (token) {
        request.headers.Authorization = "Bearer " + token;
    }

    // Return the modified request
    return request;
});

// =====================================================
// Export API for use in other files
// =====================================================
export default API;