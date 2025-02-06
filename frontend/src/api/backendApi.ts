import axios from "axios";

const backendApi = axios.create({
  // baseURL: "https://localhost:8000",
  baseURL: "https://share-frame-backend-api.vercel.app",
});

export default backendApi;
