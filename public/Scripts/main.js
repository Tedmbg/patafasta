



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
    // const signInButton = document.querySelector(".toggle-btn:first-child");
    // signInButton.classList.add("active-button");
    // signInButton.classList.remove("not-active");

// document.querySelector(".submit-btn").addEventListener("click",()=>{
//     document.querySelector(".auth-form").innerHTML = "";
// })

// delivery.js
document.querySelectorAll('.card-header').forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        body.classList.toggle('active');
    });
});

document.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const dropdown = this.nextElementSibling;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
});

document.querySelectorAll('.status-option').forEach(option => {
    option.addEventListener('click', function (e) {
        e.preventDefault();
        const newStatus = this.getAttribute('data-status');
        const statusSpan = this.closest('.card-body-delivery').previousElementSibling.querySelector('span');
        let newClass;

        switch (newStatus) {
            case 'Pending':
                newClass = 'status-pending';
                statusSpan.textContent = newStatus;
                statusSpan.className = `float-end ${newClass}`;
                break;
            case 'In transit':
                newClass = 'status-transit';
                statusSpan.textContent = newStatus;
                statusSpan.className = `float-end ${newClass}`;
                break;
            case 'Delivered':
                const password = prompt('Enter the password to confirm delivery:');
                if (password === '12345') { // Replace with your actual password
                    newClass = 'status-delivered';
                    statusSpan.textContent = newStatus;
                    statusSpan.className = `float-end ${newClass}`;
                } else {
                    alert('Incorrect password. Status set to In transit.');
                    newClass = 'status-transit';
                    statusSpan.textContent = 'In transit';
                    statusSpan.className = `float-end ${newClass}`;
                }
                break;
        }

        this.closest('.status-dropdown').style.display = 'none';
    });
});

// Hide dropdown when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.matches('.status-btn')) {
        document.querySelectorAll('.status-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});
//     const signInButton = document.querySelector(".toggle-btn:first-child");
//     signInButton.classList.add("active-button");
//     signInButton.classList.remove("not-active");
// document.querySelector()

































































