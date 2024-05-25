var loginForm = document.querySelector("form.login");
var loginText = document.querySelector(".title-text .login");
var signupForm = document.querySelector("form.signup");
var loginBtn = document.querySelector("label.login");
var signupBtn = document.querySelector("label.signup");
var signupLink = document.querySelector("form .signup-link a");
var forgetBtn = document.querySelector("form .pass-link a");
var toastContainer = document.getElementById("liveToast");
var toastBody = toastContainer.querySelector(".toast-header").innerHTML;
var users = JSON.parse(localStorage.getItem("users")) || [];


document.addEventListener("DOMContentLoaded", function (){

    signupLink.addEventListener('click', function(event) {
        event.preventDefault(); 
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });


})

function generateUserId(email) {
    return email.replace(/[^a-zA-Z0-9]/g, '') + Date.now();
}

function showToast(header, msg, textcolr) {
    const toast = new bootstrap.Toast(toastContainer);
    toastContainer.querySelector(".toast-header").innerHTML = header + toastBody;
    toastContainer.querySelector(".toast-body").innerText = msg;
    toastContainer.querySelector(".toast-header").style.color = textcolr;
    toastContainer.querySelector(".toast-body").style.color = textcolr;
    toast.show();
}

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(event.currentTarget);
    var email = formData.get("email");
    var password = formData.get("password");
    var firstName = formData.get("firstName");
    var lastName = formData.get("lastName");

    if (!users.find(function (user) { return user.email === email; })) {
        var userId = generateUserId(email);
        users.push({ id: userId, email: email, password: password, firstName: firstName, lastName: lastName, });
        showToast("Thanks", "Account created successfully", "green");
    } else {
        showToast("Error", "Account already exists", "red");
    }

    localStorage.setItem("users", JSON.stringify(users));
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(event.currentTarget);
    var userCred = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    var userExist = users.find(function (user) {
        return user.email === userCred.email;
    });

    if (!userExist || userExist.password !== userCred.password) {
        showToast("Error", "Invalid email or password", "red");
        return;
    }

    localStorage.setItem("islogdin", "true");
    localStorage.setItem("loggedInUserId", userExist.id); 
    location.href = "index.html";
});

signupBtn.addEventListener("click", function () {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});

loginBtn.addEventListener("click", function () {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});

signupLink.addEventListener("click", function () {
    signupBtn.click();
    return false;
});
