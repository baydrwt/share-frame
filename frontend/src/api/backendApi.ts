import axios from "axios";

const backendApi = axios.create({
  // baseURL: "http://localhost:8000",
  baseURL: "http://share-frame-backend-api.vercel.app",
});

export default backendApi;
