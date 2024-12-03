export const LoginUser = (username, password) => {
    if(username !== "admin" || password !== "12345"){
        alert("Invalid Credentials");
        return false;
    }

    localStorage.setItem("loggedIn", true);
    return true;
}

export const RedirectTo = (url) => {
    location.href = url;
}