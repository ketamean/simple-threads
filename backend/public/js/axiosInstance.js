const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Thay thế bằng URL API của bạn
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// before req
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("before request");
    // add token to header for auth
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// after res
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("after response: 200 ok");
    return response;
  },
  (error) => {
    // handle err
    console.log("after response: > 200 errror");
    console.log(
      `status: ${error.response.status}, message: ${error.response.data}`
    );
    if (
      error.response &&
      error.response.status === 401 &&
      error.config.url != "/users/signIn"
    ) {
      // if token invalid
      console.log("invaild token");
      window.location.href = "/users/signIn";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
