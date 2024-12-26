import axiosInstance from "./axiosInstance.js";

const textarea = document.querySelector("textarea");
textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});
console.log("");
const $postButton = document.querySelector("#post-button");
$postButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const content = document.querySelector("textarea").value;
  await axiosInstance
    .post("/auth/create-post", {
      content,
      createdAt: new Date(),
    })
    .then((response) => {
      console.log(response);
      window.location.href = "/feed";
    })
    .catch((error) => {
      console.log(error);
      alert(`Create post failed: ${error.response.data.message}`);
    });
});
