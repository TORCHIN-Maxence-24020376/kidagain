const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const toggleBtn = document.querySelector(".toggle-password");
const message = document.querySelector("#message");

if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        toggleBtn.textContent = isPassword ? "🙈" : "👁️";
        toggleBtn.setAttribute("aria-label", isPassword ? "Masquer le mot de passe" : "Afficher le mot de passe");
        toggleBtn.setAttribute("aria-pressed", String(isPassword));
    });
}

if (loginForm && emailInput && passwordInput && message) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const OK_EMAIL = "kidagain@kidagain.fr";
        const OK_PASS = "KidAgainAdmin33";

        if (email === OK_EMAIL && password === OK_PASS) {
            message.textContent = "✅ Connexion réussie !";
            message.style.color = "green";
            window.location.href = "admin.html";
        } else {
            message.textContent = "❌ Identifiants incorrects.";
            message.style.color = "red";
            message.focus?.();
        }
    });
}
