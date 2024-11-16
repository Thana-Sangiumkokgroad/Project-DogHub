document.getElementById("RegistrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const password = document.getElementById("password").value;
    const conpassword = document.getElementById("conpassword").value;
    const invalidText = document.getElementById("invalid-text");
    console.log(password)
    console.log(conpassword)
    if (password == conpassword) {
        alert("registration successful!");
        window.location.href = "/login";
    }else{
        invalidText.textContent = "email or password are incorrect.";
    }
});