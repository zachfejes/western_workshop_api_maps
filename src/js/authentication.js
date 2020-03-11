function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    let welcomeMessage = "Welcome " + profile.getName().split(" ")[0] + ", let's get you started.";

    let personalElement = document.getElementById("personal");
    let personalTextElement = document.getElementById("personalText");
    let signInElement = document.getElementById("signInWrapper");
    let signOutElement = document.getElementById("signOut");
    signInElement.style.display = "none";
    signOutElement.style.display = "inline";
    personalElement.classList.add("show");
    personalTextElement.innerHTML = welcomeMessage.toUpperCase();
}

function onSignOut() {
    console.log("clicked the sign-out button!");

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');

        let personalElement = document.getElementById("personal");
        let personalTextElement = document.getElementById("personalText");
        let signInElement = document.getElementById("signInWrapper");
        let signOutElement = document.getElementById("signOut");
        signInElement.style.display = "inline";
        signOutElement.style.display = "none";
        personalElement.classList.remove("show");
        personalTextElement.innerHTML = "";
    });
}