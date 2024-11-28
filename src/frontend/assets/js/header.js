const seeMore = document.querySelector(".see-more-button");
const setting = document.querySelector(".nav-setting-container");
const navSettingContent = document.querySelectorAll(".nav-setting-content");
const settingSvg = document.querySelector(".see-more-svg");

settingSvg.addEventListener("click", () => {
  settingSvg.classList.add("pop-up-icon");
  setTimeout(() => {
    settingSvg.classList.remove("pop-up-icon");
  }, 300);
  settingSvg.classList.toggle("active-icon");
});

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
    if (settingSvg.classList.contains("active-icon")) {
      settingSvg.classList.remove("active-icon");
    }
  }
});

seeMore.addEventListener("click", () => {
  setting.classList.toggle("active");
});
