import axios from "axios";

// send  cokkie at every single reqyest
// if dev mode, use localhost:5001/api as baseURL
// if production mode, use the production URL as baseURL
export const axiosInstance= axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true,

})