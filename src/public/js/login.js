import axiosInstance from "./axiosInstance.js";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  await axiosInstance
    .post("users/login", {
      username,
      password,
    })
    .then((response) => {
      // save token
      // console.log("save token");
      // console.log(response);
      axiosInstance.setToken(
        response.data.accessToken,
        response.data.timeExpired
      );

      // move to homepage/feed
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
      console.error("Error during login:", error.response.data.message);
      alert(`Login failed: ${error.response.data.message}`);
    });
});
