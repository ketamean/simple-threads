const love = document.querySelectorAll(".love");
const loveIcon = document.querySelectorAll(".iconoir-heart");
const likeNum = document.querySelectorAll(".like-number");
let followStatus = document.querySelectorAll(".follow-status");
const unfollowModal = document.querySelector(".unfollow-modal");
const unfollowCard = document.querySelector(".unfollow-card");
const followersPreview = document.querySelector(".followers-preview");
const followBoard = document.querySelector(".profile-follow-board");
const followersBoard = document.querySelector(".follow-board-item.followers");
const followingBoard = document.querySelector(".follow-board-item.following");
const followersTab = document.querySelector(".tab-follower");
const followingTab = document.querySelector(".tab-following");
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

function getCookies() {
	const cookies = document.cookie.split(";").map((cookie) => {
		return cookie.split("=");
	}); // get an array of key-value pairs(cookie) in string then split them by "="
	const cookieObj = Object.fromEntries(cookies); // convert the array of key-value pairs to an object
	const trimmedCookieObj = {};
	for (const key in cookieObj) {
		trimmedCookieObj[key.trim()] = cookieObj[key].trim();
	}
	return trimmedCookieObj;
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
		if(status.textContent.trim() === "Remove?" || status.textContent.trim() === "Following") {
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

editProfileSave.addEventListener("click", (event) => {
	event.preventDefault();
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

followersBoard.addEventListener("click", async(event) => {
	followersTab.classList.remove("hidden");
	followersTab.classList.add("block");
	followingTab.classList.add("hidden");
	followingTab.classList.remove("block");
	let followers = await axios.post(`/profile/:{id}/followers`, {
		user_id: userID,
	});
	followers = followers.data;
	followersTab.innerHTML = "";
	for(let user of followers) {
		const follower = `<div
					class="user w-full h-20 flex items-center justify-evenly px-3 border-b border-solid border-neon-white-15"
				>
					<img
						class="user-avatar w-16 h-16 rounded-full"
						alt=""
						src=${user.profile_picture}
					/>
					<div
						style="
							display: flex;
							align-items: center;
							justify-content: space-between;
							width: 80%;
							height: 80%;
							padding-left: 0.5rem;
						"
					>
						<div
							class="user-names flex flex-col justify-evenly h-5/6"
						>
							<div
								class="user-alias text-white text-base font-semibold"
							>${user.alias}</div>
							<div
								class="user-username text-white text-base opacity-35"
							>${user.username}</div>
						</div>
						<button
							type="button"
							class="follow-status px-4 w-28 h-8 border border-solid border-neon-white-15 rounded-xl cursor-pointer text-next text-base font-semibold bg-transparent"
							data-id="${user.id}"
							data-user = "${userID}"
						>
							Remove?
						</button>
					</div>
				</div>`
		followersTab.innerHTML += follower;
	}
	followStatus = document.querySelectorAll(".follow-status");
	followStatus.forEach((status, index) => {
		status.addEventListener("click", () => {
			if(status.textContent.trim() === "Remove?" || status.textContent.trim() === "Following") {
				currentFollowStatus = index;
				unfollowModal.classList.add("active");
				document.body.style.overflow = "hidden";
			}
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
});

followingBoard.addEventListener("click", async(event) => {
	followersTab.classList.add("hidden");
	followersTab.classList.remove("block");
	followingTab.classList.remove("hidden");
	followingTab.classList.add("block");
	let followings = await axios.post(`/profile/:{id}/followings`, {
		user_id: userID,
	});
	followings = followings.data
	followingTab.innerHTML = "";
	for(let user of followings) {
		const following = `<div
					class="user w-full h-20 flex items-center justify-evenly px-3 border-b border-solid border-neon-white-15"
				>
					<img
						class="user-avatar w-16 h-16 rounded-full"
						alt=""
						src=${user.profile_picture}
					/>
					<div
						style="
							display: flex;
							align-items: center;
							justify-content: space-between;
							width: 80%;
							height: 80%;
							padding-left: 0.5rem;
						"
					>
						<div
							class="user-names flex flex-col justify-evenly h-5/6"
						>
							<div
								class="user-alias text-white text-base font-semibold"
							>${user.alias}</div>
							<div
								class="user-username text-white text-base opacity-35"
							>${user.username}</div>
						</div>
						<button
							type="button"
							class="follow-status px-4 w-28 h-8 border border-solid border-neon-white-15 rounded-xl cursor-pointer text-next text-base font-semibold bg-transparent"
							data-id="${user.id}"
							data-user = "${userID}"
						>
							Following
						</button>
					</div>
				</div>`
		followingTab.innerHTML += following;
	}
	followStatus = document.querySelectorAll(".follow-status");
	followStatus.forEach((status, index) => {
		status.addEventListener("click", () => {
			if(status.textContent.trim() === "Following") {
				currentFollowStatus = index;
				unfollowModal.classList.add("active");
				document.body.style.overflow = "hidden";
			}
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
});