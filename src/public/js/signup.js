import axiosInstance from "./axiosInstance.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    await axiosInstance
      .post("/users/signup", {
        username,
        password,
        email,
      })
      .then((response) => {
        //sign ok
        console.log(response);
        alert("Sign up successful, please check your mail!");
      })
      .catch((error) => {
        console.log(error);
        console.error("Error during sign up:", error.response.data.message);
        alert(`Sign up failed: ${error.response.data.message}`);
      });
  });
});
