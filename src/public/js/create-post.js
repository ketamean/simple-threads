import axiosInstance from "./axiosInstance.js";

const textarea = document.querySelector("textarea");
textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

const $postButton = document.querySelector("#post-button");
$postButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const content = document.querySelector("textarea").value;
  formData.append("content", content);

  selectedFiles.forEach((file) => {
    formData.append("images", file);
  });

  await axiosInstance
    .post("/auth/create-post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response);
      window.location.href = "/auth/feed";
    })
    .catch((error) => {
      console.log(error);
      alert(`Create post failed: ${error.response.data.message}`);
    });
});

const $imageButton = document.querySelector("#image-upload");
const $fileInput = document.querySelector("#file-input");
const previewContainer = document.querySelector("#preview-container");
let selectedFiles = [];

$imageButton.addEventListener("click", () => {
  $fileInput.click();
});

$fileInput.addEventListener("change", (event) => {
  selectedFiles = [...event.target.files];
  previewContainer.innerHTML = ""; // Clear previews
  selectedFiles.forEach((file) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.height = "160px";
    img.style.width = "auto";
    previewContainer.appendChild(img);
  });
});
