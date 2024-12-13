const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Thay thế bằng URL API của bạn
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// get reset token
const resetTokenData = async () => {
  try {
    const response = await axiosInstance.get("/users/resetToken");
    return response.data;
  } catch (error) {
    console.error("Error fetching reset token data:", error);
    throw error;
  }
};

// before req
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("before request");
    // add token to header for auth
    const { token, timeExpired } = axiosInstance.getToken();
    console.log(token, timeExpired);
    const currentTime = Date.now();
    if (
      timeExpired < currentTime &&
      !config.url.includes("/users/resetToken")
    ) {
      console.log("Token expired, fetching new token...");
      const newTokenData = await resetTokenData();
      axiosInstance.setToken(
        newTokenData.accessToken,
        newTokenData.timeExpired
      );
      config.headers["Authorization"] = `Bearer ${newTokenData.token}`;
    } else if (token) {
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
    console.log("after response: > 200 error");
    console.log(
      `status: ${error.response.status}, message: ${error.response.data}`
    );
    if (
      error.response &&
      error.response.status === 401 &&
      error.config.url != "/users/signIn"
    ) {
      // if token invalid
      console.log("invalid token");
      window.location.href = "/users/signIn";
    }
    return Promise.reject(error);
  }
);

axiosInstance.setToken = (token, timeExpired) => {
  const tokenData = {
    token: token,
    timeExpired: timeExpired,
  };
  localStorage.setItem("accessToken", JSON.stringify(tokenData));
};

axiosInstance.getToken = () => {
  const tokenData = localStorage.getItem("accessToken");
  if (tokenData) {
    return JSON.parse(tokenData);
  }
  return null;
};

export default axiosInstance;
