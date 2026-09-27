import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);

// Leaderboard
export const getLeaderboard = () => api.get("/leaderboard");

// AI
export const askTutor = (data) => api.post("/ai/ask", data);
export const getRecommendation = () => api.post("/ai/recommendation");

// Quiz
export const generateQuiz = (data) => api.post("/quiz/generate", data);
export const saveQuizResult = (data) => api.post("/quiz/result", data);
export const getQuizHistory = () => api.get("/quiz/history");

// Study Plan
export const generateStudyPlan = (data) => api.post("/study-plan/generate", data);
export const getStudyPlans = () => api.get("/study-plan");
export const updateStudyPlanTask = (id, data) => api.put(`/study-plan/${id}`, data);

// Progress
export const getProgress = () => api.get("/progress");
export const getSubjectProgress = () => api.get("/progress/subjects");

export default api;
