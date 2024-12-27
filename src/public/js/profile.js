import axiosInstance from "./axiosInstance.js";
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
const editProfile = document.querySelector(".edit-profile");
const editProfileModal = document.querySelector(".edit-profile-modal");
const editProfileCancel = document.querySelector(
	".edit-profile-header-item.cancel"
);
const editProfileSave = document.querySelector(
	".edit-profile-header-item.save"
);
const numFollowers = document.querySelector(".num-follower");
const numFollowings = document.querySelector(".num-following");
const unfollowQuestion = document.querySelector(".question");
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

document.addEventListener("click", (e) => {
	// if both the followersPreview and followBoard does not have the clicked target, close the followBoard
	if (
		!followersPreview.contains(e.target) &&
		!followBoard.contains(e.target) &&
		!unfollowModal.contains(e.target) &&
		!unfollowCard.contains(e.target)
	) {
		followBoard.classList.remove("active");
		document.body.style.overflow = "auto";
	}
});

if (personal) {
	unfollowModal.addEventListener("click", (e) => {
		if (
			unfollowModal.contains(e.target) &&
			!unfollowCard.contains(e.target)
		) {
			unfollowModal.classList.remove("active");
			document.body.style.overflow = "auto";
		}
	});
}

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
		if (
			status.textContent.trim() === "Remove?" ||
			status.textContent.trim() === "Following"
		) {
			const grandparent = status.parentElement.parentElement;
			const target_alias = grandparent.getAttribute("data-alias");
			currentFollowStatus = index;
			unfollowModal.classList.add("active");
			document.body.style.overflow = "hidden";
			unfollowQuestion.innerHTML = "Unfollow &nbsp";
			unfollowQuestion.innerHTML += `					<div
						class="unfollowee-username whitespace-nowrap overflow-hidden text-ellipsis w-fit-content max-w-24"
					>
						${target_alias}
					</div>?`;
		}
	});
});

cancelUnfollow.addEventListener("click", () => {
	unfollowModal.classList.remove("active");
	document.body.style.overflow = "auto";
});

if (personal) {
	editProfile.addEventListener("click", () => {
		editProfileModal.classList.add("active");
		document.body.style.overflow = "hidden";
	});
}

editProfileCancel.addEventListener("click", () => {
	editProfileModal.classList.remove("active");
	document.body.style.overflow = "auto";
	editProfileAvatarInput.value = null;
	editProfileAvatarLabel.style.backgroundImage =
		"url(/img/user-placeholder.jpg)";
	editProfileAvatarLabel.style.backgroundSize = "cover";
	editProfileAvatarLabel.style.backgroundPosition = "center";
	editProfileForm.reset();
});

editProfileSave.addEventListener("click", async(event) => {
	event.preventDefault();
	const formData = new FormData(editProfileForm);
	const username = formData.get("username");
	const bio = formData.get("bio");
	const avatar = formData.get("avatar");
	const userForm = new FormData();
	userForm.append("user", JSON.stringify({
		username,
		bio,
	}));
	userForm.append("avatar", avatar);
	await axiosInstance.post(`auth-header/profile/${userID}`, userForm, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	}).then((res) => {
		editProfileModal.classList.remove("active");
		return location.reload();
	}).catch((err) => {
		console.error(err);
	});
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

if (personal) {
	unfollow.addEventListener("click", async (event) => {
		const targetID =
			followStatus[currentFollowStatus].getAttribute("data-id");
		event.preventDefault();
		let data = {
			user_id: userID,
			target_id: targetID,
		}
		data = JSON.stringify(data);
		await axiosInstance.delete(`auth-header/profile/${userID}/unfollow`, {
			data
		}, {
			headers: {
				"Content-Type": "application/json",
			}
		});
		numFollowings.textContent = parseInt(numFollowings.textContent) - 1;
		followStatus[currentFollowStatus].textContent = "Follow";
		followStatus[currentFollowStatus].style.backgroundColor = "#fe0034";
		followStatus[currentFollowStatus].style.color = "#FFFFFF";
		unfollowModal.classList.remove("active");
		document.body.style.overflow = "auto";
	});
}

followStatus.forEach((status, index) => {
	status.addEventListener("click", async (event) => {
		if (status.textContent === "Follow") {
			event.preventDefault();
			const followed_id = status.getAttribute("data-id");
			let data = {
				user_id: userID,
				target_id: followed_id,
			}
			data = JSON.stringify(data);
			await axiosInstance.post(`auth-header/profile/${userID}/follow`, {
				user_id: userID,
				target_id: followed_id,
			}, {
				headers: {
					"Content-Type": "application/json",
				}
			});
			numFollowings.textContent = parseInt(numFollowings.textContent) + 1;
			status.textContent = "Following";
			status.style.backgroundColor = "transparent";
			status.style.border = "0.8px solid rgba(243, 245, 247, 0.15)";
			status.style.color = "rgb(119, 119, 119)";
		}
	});
});

followersPreview.addEventListener("click", async () => {
	followBoard.classList.toggle("active");
	if (followBoard.classList.contains("active")) {
		if (
			window.matchMedia("(max-width: 768px)").matches
		) {
			document.body.style.overflow = "hidden";
		}
	}
	followersTab.classList.remove("hidden");
	followersTab.classList.add("block");
	followingTab.classList.add("hidden");
	followingTab.classList.remove("block");
	let followers = await axiosInstance.post(`auth-header/profile/:{id}/followers`, {
		user_id: userID,
	});
	followers = followers.data;
	followersTab.innerHTML = "";
	for (let user of followers) {
		let follower = `<div
					class="user w-full h-20 flex items-center justify-evenly px-3 border-b border-solid border-neon-white-15"
					data-id="${user.id}"
					data-alias="${user.alias}"
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
						</div>`;
		if (personal) {
			follower += `						
						<button
							type="button"
							class="follow-status px-4 w-28 h-8 border border-solid border-neon-white-15 rounded-xl cursor-pointer text-next text-base font-semibold bg-transparent"
							data-id="${user.id}"
							data-user = "${userID}"
						>
							Remove?
						</button>
					</div>
				</div>`;
		} else {
			follower += `</div>
				</div>`;
		}
		followersTab.innerHTML += follower;
	}
	followStatus = document.querySelectorAll(".follow-status");
	followStatus.forEach((status, index) => {
		status.addEventListener("click", () => {
			if (
				status.textContent.trim() === "Remove?" ||
				status.textContent.trim() === "Following"
			) {
				const grandparent = status.parentElement.parentElement;
				const target_alias = grandparent.getAttribute("data-alias");
				currentFollowStatus = index;
				unfollowModal.classList.add("active");
				document.body.style.overflow = "hidden";
				unfollowQuestion.innerHTML = "Unfollow &nbsp";
				unfollowQuestion.innerHTML += `					<div
						class="unfollowee-username whitespace-nowrap overflow-hidden text-ellipsis w-fit-content max-w-24"
					>
						${target_alias}
					</div>?`;
			}
		});
	});
	followStatus.forEach((status, index) => {
		status.addEventListener("click", async (event) => {
			if (status.textContent === "Follow") {
				event.preventDefault();
				const targetID = followStatus[index].getAttribute("data-id");
				// await fetch(`${userID}/follow`, {
				// 	method: "PUT",
				// 	headers: {
				// 		"Content-Type": "application/json",
				// 	},
				// 	body: JSON.stringify({
				// 		user_id: userID,
				// 		target_id: targetID,
				// 	}),
				// });
				numFollowings.textContent =
					parseInt(numFollowings.textContent) + 1;
				status.textContent = "Following";
				status.style.backgroundColor = "transparent";
				status.style.border = "0.8px solid rgba(243, 245, 247, 0.15)";
				status.style.color = "rgb(119, 119, 119)";
			}
		});
	});
});

followersBoard.addEventListener("click", async (event) => {
	followersTab.classList.remove("hidden");
	followersTab.classList.add("block");
	followingTab.classList.add("hidden");
	followingTab.classList.remove("block");
	let followers = await axiosInstance.post(`auth-header/profile/:{id}/followers`, {
		user_id: userID,
	});
	followers = followers.data;
	followersTab.innerHTML = "";
	for (let user of followers) {
		let follower = `<div
					class="user w-full h-20 flex items-center justify-evenly px-3 border-b border-solid border-neon-white-15"
					data-id="${user.id}"
					data-alias="${user.alias}"
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
						</div>`;
		if (personal) {
			follower += `						
						<button
							type="button"
							class="follow-status px-4 w-28 h-8 border border-solid border-neon-white-15 rounded-xl cursor-pointer text-next text-base font-semibold bg-transparent"
							data-id="${user.id}"
							data-user = "${userID}"
						>
							Remove?
						</button>
					</div>
				</div>`;
		} else {
			follower += `</div>
				</div>`;
		}
		followersTab.innerHTML += follower;
	}
	followStatus = document.querySelectorAll(".follow-status");
	followStatus.forEach((status, index) => {
		status.addEventListener("click", () => {
			if (
				status.textContent.trim() === "Remove?" ||
				status.textContent.trim() === "Following"
			) {
				const grandparent = status.parentElement.parentElement;
				const target_alias = grandparent.getAttribute("data-alias");
				currentFollowStatus = index;
				unfollowModal.classList.add("active");
				document.body.style.overflow = "hidden";
				unfollowQuestion.innerHTML = "Unfollow &nbsp";
				unfollowQuestion.innerHTML += `					<div
						class="unfollowee-username whitespace-nowrap overflow-hidden text-ellipsis w-fit-content max-w-24"
					>
						${target_alias}
					</div>?`;
			}
		});
	});
	followStatus.forEach((status, index) => {
		status.addEventListener("click", async (event) => {
			if (status.textContent === "Follow") {
				event.preventDefault();
				const targetID = followStatus[index].getAttribute("data-id");
				let data = {
					user_id: userID,
					target_id: targetID,
				};
				data = JSON.stringify(data);
				await axiosInstance.post(`auth-header/profile/${userID}/follow`, {
					user_id: userID,
					target_id: targetID
				}, {
					headers: {
						"Content-Type": "application/json",
					}
				});
				numFollowings.textContent =
					parseInt(numFollowings.textContent) + 1;
				status.textContent = "Following";
				status.style.backgroundColor = "transparent";
				status.style.border = "0.8px solid rgba(243, 245, 247, 0.15)";
				status.style.color = "rgb(119, 119, 119)";
			}
		});
	});
});

followingBoard.addEventListener("click", async (event) => {
	followersTab.classList.add("hidden");
	followersTab.classList.remove("block");
	followingTab.classList.remove("hidden");
	followingTab.classList.add("block");
	let followings = await axiosInstance.post(`auth-header/profile/:{id}/followings`, {
		user_id: userID,
	});
	followings = followings.data;
	followingTab.innerHTML = "";
	for (let user of followings) {
		let following = `<div
					class="user w-full h-20 flex items-center justify-evenly px-3 border-b border-solid border-neon-white-15"
					data-id="${user.id}"
					data-alias="${user.alias}"
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
						</div>`;
		if (personal) {
			following += `						
				<button
					type="button"
					class="follow-status px-4 w-28 h-8 border border-solid border-neon-white-15 rounded-xl cursor-pointer text-next text-base font-semibold bg-transparent"
					data-id="${user.id}"
					data-user = "${userID}"
				>
					Following
				</button>
			</div>
		</div>`;
		} else {
			following += `</div>
			</div>`;
		}
		followingTab.innerHTML += following;
	}
	followStatus = document.querySelectorAll(".follow-status");
	followStatus.forEach((status, index) => {
		status.addEventListener("click", () => {
			if (status.textContent.trim() === "Following") {
				const grandparent = status.parentElement.parentElement;
				const target_alias = grandparent.getAttribute("data-alias");
				currentFollowStatus = index;
				unfollowModal.classList.add("active");
				document.body.style.overflow = "hidden";
				unfollowQuestion.innerHTML = "Unfollow &nbsp";
				unfollowQuestion.innerHTML += `					<div
						class="unfollowee-username whitespace-nowrap overflow-hidden text-ellipsis w-fit-content max-w-24"
					>
						${target_alias}
					</div>?`;
			}
		});
	});
	followStatus.forEach((status, index) => {
		status.addEventListener("click", async (event) => {
			if (status.textContent === "Follow") {
				event.preventDefault();
				const targetID = followStatus[index].getAttribute("data-id");
				let data = {
					user_id: userID,
					target_id: targetID,
				}
				data = JSON.stringify(data);
				await axiosInstance.post(`auth-header/profile/${userID}/follow`, {
					user_id: userID,
					target_id: targetID
				}, {
					headers: {
						"Content-Type": "application/json",
					}
				});
				numFollowings.textContent =
					parseInt(numFollowings.textContent) + 1;
				status.textContent = "Following";
				status.style.backgroundColor = "transparent";
				status.style.border = "0.8px solid rgba(243, 245, 247, 0.15)";
				status.style.color = "rgb(119, 119, 119)";
			}
		});
	});
});

if(!personal) {
	const followButton = document.querySelector(".follow-button");
	followButton.addEventListener("click", async (event) => {
		event.preventDefault();
		if(followButton.textContent === "Follow") {
			await axiosInstance.post(`auth-header/profile/${userID}/follow`, {
				user_id: tokenID,
				target_id: userID
			}, {
				headers: {
					"Content-Type": "application/json",
				}
			});
			numFollowings.textContent = parseInt(numFollowings.textContent) + 1;
			followButton.textContent = "Following";
			followButton.style.backgroundColor = "transparent";
			followButton.style.border = "0.8px solid rgba(243, 245, 247, 0.15)";
			followButton.style.color = "rgb(119, 119, 119)";
		}
		else{
			let data = {
				user_id: tokenID,
				target_id: userID,
			}
			data = JSON.stringify(data);
			await axiosInstance.delete(`auth-header/profile/${userID}/unfollow`, {
				data
			}, {
				headers: {
					"Content-Type": "application/json",
				}
			});
			numFollowings.textContent = parseInt(numFollowings.textContent) - 1;
			followButton.textContent = "Follow";
			followButton.style.backgroundColor = "#fe0034";
			followButton.style.color = "#FFFFFF";
		}
	});
}