const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.13:3000', //"http://localhost:3000", // Thay thế bằng URL API của bạn
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  return { token: null, timeExpired: null };
};

// get reset token
const resetTokenData = async () => {
  try {
    const response = await axiosInstance.get("/users/resettoken");
    console.log("get reset token success!");
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
      !config.url.includes("/users/resettoken") &&
      !config.url.includes("/users/login") &&
      !config.url.includes("/users/signup")
    ) {
      console.log("Token expired, fetching new token...");
      const newTokenData = await resetTokenData();
      axiosInstance.setToken(
        newTokenData.accessToken,
        newTokenData.timeExpired
      );
      config.headers["Authorization"] = `Bearer ${newTokenData.accessToken}`;
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
  async (response) => {
    console.log("after response: 200 ok");
    return response;
  },
  (error) => {
    // handle err
    console.log("after response: > 200 error");
    if (error.response) {
      console.log(
        `status: ${error.response.status}, message: ${error.response.data}`
      );
      if (error.response.status === 401 && error.config.url != "/users/login") {
        // if token invalid
        console.log("invalid token");
        window.location.href = "/users/login";
      }
    } else {
      console.log("Error without response:", error);
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;