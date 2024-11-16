document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const invalidText = document.getElementById("invalid-text");

    if (email == "prameprolo123@gmail.com" && password == "963963prame") {
        window.location.href = "/homepage";
        alert("Login successful!");
    }else{
        invalidText.textContent = "email or password is incorrect.";
    }
});