
console.log("hello world");

const form = document.getElementById("register-form");

const inputUsername = document.getElementById("username");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputConfirmPassword = document.getElementById("confirm-password");
const inputCellPhone = document.getElementById("cell-phone");
const inputReferenceCode = document.getElementById("reference-code");
const inputAge = document.getElementById("age-checkbox");

const usernameError = document.getElementById("username-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const phoneError = document.getElementById("cell-phone-error");
const referenceCodeError = document.getElementById("reference-code-error");
const ageError = document.getElementById("age-error");


const users = JSON.parse(localStorage.getItem("users")) || [];



// VALIDACION GENERAL


function validateField(input, errorElement, message) {
    if (input.value.trim() === "") {
        errorElement.textContent = message;
        return false;
    }

    errorElement.textContent = "";
    return true;
}



// VALIDAR USERNAME


function validateUsernameField() {
    const username = inputUsername.value.trim();

    if (username === "") {
        usernameError.textContent = "The username is empty!";
        return false;
    }

    if (username.length < 3) {
        usernameError.textContent = "Enter at least 3 characters!";
        return false;
    }

    usernameError.textContent = "";
    return true;
}



// VALIDAR EMAIL


function validateEmail() {
    const email = inputEmail.value.trim().toLowerCase();

    if (email === "") {
        emailError.textContent = "Email is required!";
        return false;
    }

    if (email.length > 100) {
        emailError.textContent = "Email must be 100 characters max!";
        return false;
    }

    if (!email.endsWith("@duoc.cl") &&
        !email.endsWith("@profesor.duoc.cl") &&
        !email.endsWith("@gmail.com")) {
        emailError.textContent = "Only Duoc or Gmail emails are allowed!";
        return false;
    }

    emailError.textContent = "";
    return true;
}

// VALIDAR PASSWORD


function validatePassword() {
    const password = inputPassword.value;

    if (password === "") {
        passwordError.textContent = "The password is empty!";
        return false;
    }

    if (password.length < 4) {
        passwordError.textContent = "The password must be 4 characters min!";
        return false;
    }

    passwordError.textContent = "";
    return true;
}



// CONFIRMAR PASSWORD


function validateConfirmPassword() {
    if (inputConfirmPassword.value === "") {
        confirmPasswordError.textContent = "Please confirm your password!";
        return false;
    }

    if (inputPassword.value !== inputConfirmPassword.value) {
        confirmPasswordError.textContent = "The passwords are not the same!";
        return false;
    }

    confirmPasswordError.textContent = "";
    return true;
}



// VALIDAR TELÉFONO


function validatePhone() {
    const phone = inputCellPhone.value.trim();

    if (phone === "") {
        phoneError.textContent = "The phone is empty!";
        return false;
    }

    if (isNaN(phone)) {
        phoneError.textContent = "The phone must contain only numbers!";
        return false;
    }

    if (phone.length < 9) {
        phoneError.textContent = "The phone must have at least 9 digits!";
        return false;
    }

    phoneError.textContent = "";
    return true;
}

// VALIDAR EDAD

function validateAge() {
    if (!inputAge.checked) {
        ageError.textContent = "You must confirm your legal age!";
        return false;
    }

    ageError.textContent = "";
    return true;
}

// CREAR USUARIO

function createUser() {
    return {
        username: inputUsername.value.trim(),
        email: inputEmail.value.trim().toLowerCase(),
        password: inputPassword.value,
        cellphone: inputCellPhone.value.trim(),
        referenceCode: inputReferenceCode.value.trim(),
        ageConfirmed: inputAge.checked
    };
}

// COMPROBAR DUPLICADOS

function usernameExists(username) {
    return users.some(
        user => user.username.toLowerCase() === username.toLowerCase()
    );
}

function emailExists(email) {
    return users.some(
        user => user.email === email.toLowerCase()
    );
}

function phoneExists(phone) {
    return users.some(
        user => user.cellphone === phone
    );
}

// VALIDAR FORMULARIO

function validateForm() {
    // Validaciones de campos

    const validatedUsername = validateUsernameField();
    const validatedEmail = validateEmail();
    const validatedPassword = validatePassword();
    const validatedConfirmPassword = validateConfirmPassword();
    const validatedPhone = validatePhone();
    const validatedAge = validateAge();

    if (
        !validatedUsername ||
        !validatedEmail ||
        !validatedPassword ||
        !validatedConfirmPassword ||
        !validatedPhone ||
        !validatedAge
    ) {
        return false;
    }
    // Crear usuario temporalmente para
    // comprobar si ya existe.

    const user = createUser();

    if (usernameExists(user.username)) {
        usernameError.textContent = "This username is already registered!";
        return false;
    }

    if (emailExists(user.email)) {
        emailError.textContent = "This email is already registered!";
        return false;
    }
    if (phoneExists(user.cellphone)) {
        phoneError.textContent = "This phone is already registered!";
        return false;
    }
    return true;
}


// -------------------------
// SUBMIT
// -------------------------

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const user = createUser();

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));

    console.log("Usuario registrado:", user);
    console.log("Todos los usuarios:", users);
});