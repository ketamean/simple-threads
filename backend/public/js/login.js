import axiosInstance from "./axiosInstance.js";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  axiosInstance
    .post("/users/signIn", {
      username,
      password,
    })
    .then((response) => {
      // save token
      axiosInstance.setToken(
        response.data.accessToken,
        response.data.timeExpired
      );

      // move to homepage/feed
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error during login:", error.response.data.message);
      alert(`Login failed: ${error.response.data.message}`);
    });
});
