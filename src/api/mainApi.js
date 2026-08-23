import axios from "axios";

export const mainApi = axios.create({
  baseURL: "http://localhost:8899/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// parsedAuthState?.state?.token จะเก็บข้อมูลเป็น {} แล้ว authState จะได้ string ต้องแปลงแล้ว token จะอยู่ที่ parsedAuthState.state.token
mainApi.interceptors.request.use(
  (config) => {
    const authState = localStorage.getItem("authState");

    if (authState) {
      try {
        const parsedAuthState = JSON.parse(authState);
        const token = parsedAuthState?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("Token:", token);
        console.log("Request:", config.url);
      } catch (error) {
        console.error("Invalid authState:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const Register = async (body) => {
  return await mainApi.post("/auth/register", body);
};

export const getCategory = async () => {
  return await mainApi.get("/categories");
};
