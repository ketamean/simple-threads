document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const password = formData.get("password");
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get("resetToken");

    try {
      console.log(password);
      console.log(resetToken);

      const response = await fetch(
        `/users/auth/setpassword?resetToken=${resetToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: password }),
        }
      );

      if (response.ok) {
        // Handle successful response
        alert("Password reset successfully!");
        window.location.href = "/login"; // Redirect to login page
      } else {
        // Handle error response
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while resetting the password.");
    }
  });
});
