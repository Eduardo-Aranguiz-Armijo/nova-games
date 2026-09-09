const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
console.log("editado")
if(currentUser){
    loginLink.style.display = "none";
    registerLink.style.display = "none";
}