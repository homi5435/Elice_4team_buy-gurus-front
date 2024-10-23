import axios from "axios";

axios.interceptors.response.use(
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
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
