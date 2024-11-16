const activity_tag = document.querySelectorAll(".activity-link-tag");
const activity_follow_screen = document.querySelectorAll(".activity-follow");
const see_more_button = document.querySelector(".see-more-svg");
const navSettingContainer = document.querySelector(".nav-setting-container");
const notificationButton = document.querySelector(".notification-svg");
const like_button = document.querySelectorAll(
	".activity-follow-infor-react.like"
);
const followContainer = document.querySelectorAll(".activity-follow-container");

// delete or mark read button
const markOrDeleteContainer = document.querySelector(
	".activity-notification-block"
);
const deleteButton = document.querySelector(".delete-button");
const markButton = document.querySelector(".mark-read-button");
const deleteConfirmationOverlay = document.querySelector(
	".delete-confirmation-overlay"
);
const confirmDeleteButton = document.querySelector(".confirm-delete-button");
const cancelDeleteButton = document.querySelector(".cancel-delete-button");

// change screen tag handle
activity_tag.forEach((tag) => {
	tag.addEventListener("click", (event) => {
		activity_tag.forEach((tag) => tag.classList.remove("tag-active"));

		const currentTag = event.currentTarget;
		currentTag.classList.add("pop-up");
		setTimeout(() => {
			currentTag.classList.remove("pop-up");
			currentTag.classList.add("tag-active");
		}, 200);
		if (notificationButton.classList.contains("active")) {
			handleNotificationButtonClick();
		}
		const tag_content = event.currentTarget.textContent.trim();
		switch (tag_content) {
			case "All":
				console.log("All selected");
				activity_follow_screen.forEach((tag) => {
					tag.classList.add("hidden");
				});
				document
					.querySelector(".activity-follow.all")
					.classList.remove("hidden");
				break;
			case "Follow":
				console.log("Follow selected");
				activity_follow_screen.forEach((tag) => {
					tag.classList.add("hidden");
				});
				document
					.querySelector(".activity-follow.follow")
					.classList.remove("hidden");
				break;
			case "Replies":
				console.log("Replies selected");
				activity_follow_screen.forEach((tag) => {
					tag.classList.add("hidden");
				});
				document
					.querySelector(".activity-follow.none")
					.classList.remove("hidden");
				break;
			case "Mentions":
				console.log("Mentions selected");
				activity_follow_screen.forEach((tag) => {
					tag.classList.add("hidden");
				});
				document
					.querySelector(".activity-follow.none")
					.classList.remove("hidden");
				break;
			case "Quotes":
				console.log("Quotes selected");
				activity_follow_screen.forEach((tag) => {
					tag.classList.add("hidden");
				});
				document
					.querySelector(".activity-follow.none")
					.classList.remove("hidden");
				break;
			case "Reposts":
				console.log("Reposts selected");
				activity_follow_screen.forEach((tag) => {
					tag.classList.add("hidden");
				});
				document
					.querySelector(".activity-follow.none")
					.classList.remove("hidden");
				break;
			case "Verified":
				console.log("Verified selected");
				activity_follow_screen.forEach((tag) => {
					tag.classList.add("hidden");
				});
				document
					.querySelector(".activity-follow.none")
					.classList.remove("hidden");
				break;
			default:
				console.log("Default");
		}
	});
});

//change see more button and on/off nav setting
see_more_button.addEventListener("click", (event) => {
	const currentTag = event.currentTarget;
	currentTag.classList.add("pop-up");
	setTimeout(() => {
		currentTag.classList.remove("pop-up");
	}, 300);
	if (currentTag.classList.contains("active")) {
		currentTag.classList.remove("active");
		navSettingContainer.classList.add("hidden");
	} else {
		currentTag.classList.add("active");
		navSettingContainer.classList.remove("hidden");
	}
});

document.addEventListener("click", (event) => {
	if (
		!navSettingContainer.contains(event.target) &&
		!see_more_button.contains(event.target)
	) {
		navSettingContainer.classList.add("hidden");
		see_more_button.classList.remove("active");
	}
});

// react-icon

like_button.forEach((button) => {
	button.addEventListener("click", (event) => {
		const currentTag = event.currentTarget;
		currentTag.classList.add("pop-up");
		setTimeout(() => {
			currentTag.classList.remove("pop-up");
		}, 300);

		const svgElement = currentTag.querySelector("svg");
		const spanElement = currentTag.querySelector("span");

		if (
			svgElement.classList.contains("react-like-on") &&
			spanElement.classList.contains("react-like-on")
		) {
			svgElement.classList.remove("react-like-on");
			spanElement.classList.remove("react-like-on");
		} else {
			svgElement.classList.add("react-like-on");
			spanElement.classList.add("react-like-on");
		}
	});
});

//handle notificationButton

function handleNotificationButtonClick() {
	console.log("1111");
	const currentTag = notificationButton;
	currentTag.classList.add("pop-up");
	setTimeout(() => {
		currentTag.classList.remove("pop-up");
	}, 300);
	if (currentTag.classList.contains("active")) {
		markOrDeleteContainer.classList.add("hidden");
		currentTag.classList.remove("active");
		followContainer.forEach((container) => {
			container.classList.remove("grid-check-box");
			container
				.querySelector(".activity-follow-checkbox")
				.classList.add("hidden");
			const rightInfo = container.querySelector(
				".activity-follow-infor-right"
			);
			if (rightInfo != null) {
				rightInfo.classList.remove("hidden");
			} else {
				container
					.querySelector(".activity-follow-infor-header-name")
					.classList.add("change-width");
			}
		});
	} else {
		markOrDeleteContainer.classList.remove("hidden");
		currentTag.classList.add("active");
		followContainer.forEach((container) => {
			container.classList.add("grid-check-box");
			container
				.querySelector(".activity-follow-checkbox")
				.classList.remove("hidden");
			const rightInfo = container.querySelector(
				".activity-follow-infor-right"
			);
			if (rightInfo != null) {
				rightInfo.classList.add("hidden");
			} else {
				container
					.querySelector(".activity-follow-infor-header-name")
					.classList.remove("change-width");
			}
		});
	}
}

notificationButton.addEventListener("click", () =>
	handleNotificationButtonClick()
);

// handle delete notification

deleteButton.addEventListener("click", () => {
	console.log("delete");
	deleteConfirmationOverlay.classList.remove("hidden");
});

// confirm delete notification
confirmDeleteButton.addEventListener("click", () => {
	console.log("confirm delete");
	followContainer.forEach((container) => {
		const checkbox = container.querySelector(".check-box");
		if (checkbox.checked) {
			container.remove();
		}
	});
	deleteConfirmationOverlay.classList.add("hidden");
});

// cancel delete notification
cancelDeleteButton.addEventListener("click", () => {
	console.log("cancel delete");
	followContainer.forEach((container) => {
		const checkbox = container.querySelector(".check-box");
		checkbox.checked = false;
	});
	deleteConfirmationOverlay.classList.add("hidden");
});

deleteConfirmationOverlay.addEventListener("click", (event) => {
	const deleteConfirmationContainer = document.querySelector(
		".delete-confirmation-container"
	);
	if (!deleteConfirmationContainer.contains(event.target)) {
		deleteConfirmationOverlay.classList.add("hidden");
	}
});

// mark read
markButton.addEventListener("click", () => {
	console.log("mark read");
	followContainer.forEach((container) => {
		const checkbox = container.querySelector(".check-box");
		if (checkbox.checked) {
			container.classList.remove("unread");
			checkbox.checked = false;
		}
	});
});
