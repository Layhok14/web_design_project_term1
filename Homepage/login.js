function login() {
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;

    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (loginEmail === "" || loginPassword === "") {
        alert("Please fill in all fields");
        return;
    }

    if (loginEmail === savedEmail && loginPassword === savedPassword) {
        alert("Login successful!");
        window.location.href = "homepage.html";
    } else {
        alert("Invalid email or password");
    }
}

