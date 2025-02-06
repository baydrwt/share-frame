import axios from "axios";

const backendApi = axios.create({
  baseURL: "https://share-frame.vercel.app",
});

export default backendApi;
