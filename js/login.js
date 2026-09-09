const form = document.getElementById("login-form");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const users = JSON.parse(localStorage.getItem("users")) || [];

function validateEmpty(inputValue,errorElement,message){
    if(inputValue === ""){
        errorElement.textContent = message;
        return false;
    }

    errorElement.textContent = "";
    return true;
}

function validateEmail(){
    const email = inputEmail.value.trim().toLowerCase();

    if(!validateEmpty(
        email,
        emailError,
        "Email is required!"
    )){
        return false;
    }

    if(email.length > 100){
        emailError.textContent = "Email must be 100 characters max!";
        return false;
    }

    if(
        !email.endsWith("@duoc.cl") &&
        !email.endsWith("@profesor.duoc.cl") &&
        !email.endsWith("@gmail.com")
    ){
        emailError.textContent = "Only Duoc or Gmail emails are allowed!";
        return false;
    }

    emailError.textContent = "";
    return true;
}

function validatePassword(){
    const password = inputPassword.value.trim();

    if(!validateEmpty(
        password,
        passwordError,
        "Password is required!"
    )){
        return false;
    }

    if(password.length < 4 || password.length > 10){
        passwordError.textContent = "The password must be between 4 and 10 characters!";
        return false;
    }

    passwordError.textContent = "";
    return true;
}

function findUser(email,password){
    return users.find(user =>
        user.email === email &&
        user.password === password
    );
}

function validateForm(){
    const validatedEmail = validateEmail();
    const validatedPassword = validatePassword();

    if(
        !validatedEmail ||
        !validatedPassword
    ){
        return false;
    }

    return true;
}

form.addEventListener("submit",function(event){
    event.preventDefault();

    if(!validateForm()){
        return;
    }

    const email = inputEmail.value.trim().toLowerCase();
    const password = inputPassword.value.trim();

    const user = findUser(email,password);

    if(!user){
        passwordError.textContent = "Email or password is incorrect!";
        return;
    }
    
    localStorage.setItem("currentUser",JSON.stringify(user));
    console.log("Login correcto:",user);
    window.location.href = "./home.html";
});