const toggleBtn = document.querySelector(".toggle-password");
const passwordInput = document.querySelector("#password");

toggleBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    toggleBtn.textContent = type === "password" ? "👁️" : "🙈";
});