const login = document.querySelector(".login");

login.addEventListener("submit", (e) => {
    e.preventDefault();
    let anchor = document.createElement("a");
    anchor.href = "./feeds/index.html";
    anchor.click();
});