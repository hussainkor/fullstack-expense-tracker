import axios from "axios";

const API_URL = `https://fullstack-expense-tracker-ssiy.onrender.com/api`;

//const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

export function setAuthToken(token: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
