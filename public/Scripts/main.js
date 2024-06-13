const buttons = document.querySelectorAll(".toggle-btn");
buttons.forEach(button => {
    button.addEventListener("mouseover",()=>{
        button.classList.add("active-button");
        button.classList.remove("not-active");
    });

    button.addEventListener("mouseout",()=>{
        button.classList.remove("active-button");
        button.classList.add("not-active");
    });
});
  // Ensure "Sign In" button is active by default
//     const signInButton = document.querySelector(".toggle-btn:first-child");
//     signInButton.classList.add("active-button");
//     signInButton.classList.remove("not-active");
// document.querySelector()







































































