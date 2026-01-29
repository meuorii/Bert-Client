import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:5000/api"
})

export const getDashboardData = () => api.get("/dashboard");
export const getRecentFeedback = () => api.get("/recent-feedback");
export const getRecommendations = () => api.get("/recommendations");
export const getAllFeedback = () => api.get("/all-feedback");
export const getServicePerformance = () => api.get("/service-performance");
export const getNegativeFeedback = () => api.get("/get-negative-feedback");
export const loginAdmin = (credentials) => api.post("/login", credentials);

export default api