document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const emailOrUsername = formData.get("username-email");
    try {
      const response = await fetch("/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: emailOrUsername }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
      } else {
        console.error(`Error: ${result.message}`);
      }
      alert(result.message);
    } catch (error) {
      console.error("An error occurred:", error);
      alert(error);
    }
  });
});
