const seeMore = document.querySelector(".see-more-button");
const setting = document.querySelector(".nav-setting-container");
const navSettingContent = document.querySelectorAll(".nav-setting-content");

navSettingContent.forEach((content) => {
  content.addEventListener("click", (event) => {
    content.classList.add("pop-up");
    setTimeout(() => {
      content.classList.remove("pop-up");
    }, 500);
  });
});

document.addEventListener("click", (event) => {
  if (!setting.contains(event.target) && !seeMore.contains(event.target)) {
    if (setting.classList.contains("active")) {
      setting.classList.remove("active");
    }
  }
});

seeMore.addEventListener("click", () => {
  setting.classList.toggle("active");
});
