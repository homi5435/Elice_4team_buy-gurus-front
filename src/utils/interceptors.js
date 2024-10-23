import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (error.response.status === 401 && error.config.url !== "/api/token") {
      try {
        const res = await axios.post("/api/token");
        if (res.status === 200) {
          return axios.request(error.config);
        }
      } catch (tokenError) {
        if (!tokenError?.config?.url.include("?no-redirect")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
