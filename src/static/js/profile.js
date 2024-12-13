const love = document.querySelectorAll(".love");
const loveIcon = document.querySelectorAll(".iconoir-heart");
const likeNum = document.querySelectorAll(".like-number");
const followStatus = document.querySelectorAll(".follow-status");
const unfollowModal = document.querySelector(".unfollow-modal");
const unfollowCard = document.querySelector(".unfollow-card");
const followersPreview = document.querySelector(".followers-preview");
const followBoard = document.querySelector(".profile-follow-board");
const cancelUnfollow = document.querySelector(".cancel");
const actionRepost = document.querySelectorAll(".action.repost");
const shareModal = document.querySelector(".share-modal");
const editProfile = document.querySelector(".edit-profile");
const editProfileModal = document.querySelector(".edit-profile-modal");
const editProfileCancel = document.querySelector(
	".edit-profile-header-item.cancel"
);
const editProfileSave = document.querySelector(
	".edit-profile-header-item.save"
);
const editProfileForm = document.querySelector(".edit-profile-form");
const editProfileAvatarLabel = document.querySelector(".avatar-label");
const editProfileAvatarInput = document.querySelector(".avatar-input");
const followBoardItem = document.querySelectorAll(".follow-board-item");
const profileTabItem = document.querySelectorAll(".profile-tab-item");
const unfollow = document.querySelector(".unfollow");
let currentFollowStatus = -1;

for (let i = 0; i < love.length; i++) {
	love[i].addEventListener("click", () => {
		if (loveIcon[i].classList.contains("iconoir-heart-solid")) {
			likeNum[i].textContent = parseInt(likeNum[i].textContent) - 1;
			loveIcon[i].classList.remove("iconoir-heart-solid");
			loveIcon[i].classList.add("iconoir-heart");
			love[i].style.color = "#CCCCCC";
		} else {
			likeNum[i].textContent = parseInt(likeNum[i].textContent) + 1;
			loveIcon[i].classList.remove("iconoir-heart");
			loveIcon[i].classList.add("iconoir-heart-solid");
			love[i].style.color = "#fe0034";
		}
	});
}

followersPreview.addEventListener("click", async() => {
	followBoard.classList.toggle("active");
	if (followBoard.classList.contains("active")) {
		document.body.style.overflow = "hidden";
	}
});

document.addEventListener("click", (e) => {
	// if both the followersPreview and followBoard does not have the clicked target, close the followBoard
	if (
		!followersPreview.contains(e.target) &&
		!followBoard.contains(e.target) &&
		!unfollowModal.contains(e.target) &&
		!unfollowCard.contains(e.target) &&
		!shareModal.contains(e.target) &&
		!shareModal.classList.contains("active")
	) {
		followBoard.classList.remove("active");
		document.body.style.overflow = "auto";
	}
});

unfollowModal.addEventListener("click", (e) => {
	if (unfollowModal.contains(e.target) && !unfollowCard.contains(e.target)) {
		unfollowModal.classList.remove("active");
		document.body.style.overflow = "auto";
	}
});

followBoardItem.forEach((item) => {
	item.addEventListener("click", () => {
		followBoardItem.forEach((otherItem) => {
			otherItem.classList.remove("active");
		});
		item.classList.add("active");
	});
});

followStatus.forEach((status, index) => {
	status.addEventListener("click", () => {
		if(status.textContent.trim() === "Following") {
			currentFollowStatus = index;
			unfollowModal.classList.add("active");
			document.body.style.overflow = "hidden";
		}
	});
});

cancelUnfollow.addEventListener("click", () => {
	unfollowModal.classList.remove("active");
	document.body.style.overflow = "auto";
});

actionRepost.forEach((repost) => {
	repost.addEventListener("click", () => {
		shareModal.classList.add("active");
		document.body.style.overflow = "hidden";
	});
});

shareModal.addEventListener("click", (e) => {
	if (shareModal.contains(e.target)) {
		shareModal.classList.remove("active");
		document.body.style.overflow = "auto";
	}
});

editProfile.addEventListener("click", () => {
	editProfileModal.classList.add("active");
	document.body.style.overflow = "hidden";
});

editProfileCancel.addEventListener("click", () => {
	editProfileModal.classList.remove("active");
	document.body.style.overflow = "auto";
	editProfileAvatarInput.value = null;
	editProfileAvatarLabel.style.backgroundImage = "url(/img/user-placeholder.jpg)";
	editProfileAvatarLabel.style.backgroundSize = "cover";
	editProfileAvatarLabel.style.backgroundPosition = "center";
	editProfileForm.reset();
});

editProfileSave.addEventListener("click", () => {
	editProfileForm.submit();
	setTimeout(() => {
		editProfileModal.classList.remove("active");
		document.body.style.overflow = "auto";
	}, 2000);
});

editProfileAvatarInput.addEventListener("change", () => {
	const file = editProfileAvatarInput.files[0];
	const blob = URL.createObjectURL(file);
	editProfileAvatarLabel.style.backgroundImage = `url(${blob})`;
	editProfileAvatarLabel.style.backgroundSize = "cover";
	editProfileAvatarLabel.style.backgroundPosition = "center";
});

editProfileAvatarLabel.addEventListener("click", () => {
	editProfileAvatarInput.click();
});

profileTabItem.forEach((item) => {
	item.addEventListener("click", () => {
		profileTabItem.forEach((otherItem) => {
			otherItem.classList.remove("active");
		});
		item.classList.add("active");
	});
});

followStatus.forEach((status, index) => {
	status.addEventListener("click", async(event) => {
		if (status.textContent === "Follow") {
			event.preventDefault();
			const followed_id = status.getAttribute("data-id");
			const user_id = status.getAttribute("data-user");
			await fetch(`/follow/:{id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_id: user_id,
					target_id: followed_id,
				}),
			});
			status.textContent = "Following";
			status.style.backgroundColor = "transparent";
			status.style.border = "0.8px solid rgba(243, 245, 247, 0.15)";
			status.style.color = "rgb(119, 119, 119)";
		}
	});
});

unfollow.addEventListener("click", async(event) => {
	const followed_id = followStatus[currentFollowStatus].getAttribute("data-id");
	const user_id = followStatus[currentFollowStatus].getAttribute("data-user");
	event.preventDefault();
	await fetch(`/unfollow/:{id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			user_id: user_id,
			target_id: followed_id,
		}),
	});
	followStatus[currentFollowStatus].textContent = "Follow";
	followStatus[currentFollowStatus].style.backgroundColor = "#fe0034";
	followStatus[currentFollowStatus].style.color = "#FFFFFF";
	unfollowModal.classList.remove("active");
	document.body.style.overflow = "auto";
});