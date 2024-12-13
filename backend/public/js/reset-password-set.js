document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const queryParams = new URLSearchParams(window.location.search);
    const resetToken = queryParams.get("resetToken");
    try {
      const response = await fetch(
        `/users/auth/link/resetPass?resetToken=${resetToken}`,
        {
          method: "POST",
          body: JSON.stringify({
            password: formData.get("password"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log("Password reset successful");
      } else {
        console.log("Password reset failed");
      }
      alter(result.message);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  });
});
