const seeMore = document.querySelector(".see-more-button");
const setting = document.querySelector(".nav-setting-container");
const navSettingContent = document.querySelectorAll(".nav-setting-content");

navSettingContent.forEach((content) => {
	content.addEventListener("click", (event) => {
		content.classList.add("pop-up");
		setTimeout(() => {
			content.classList.remove("pop-up");
			content.style.backgroundColor = "transparent";
		}, 500);
	});
});

document.addEventListener("click", (event) => {
    if(!setting.contains(event.target) && !seeMore.contains(event.target)) {
        setting.classList.add("hidden");
    }
});

seeMore.addEventListener("click", () => {
	setting.classList.toggle("active");
});