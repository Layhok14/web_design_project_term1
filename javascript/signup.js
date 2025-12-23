
// User input store in localStorage then use it to login 
//BY calling const savePaswword = localStorage.getItem("userEmail") 
function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // validation
    if (email === "" || password === "") {
        alert("Please fill in all fields");
        return;
    }

    // save to localStorage
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("Sign up successful!");
    window.location.href = "login.html"; // go to login page
}


