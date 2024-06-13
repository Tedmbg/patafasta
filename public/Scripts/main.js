



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



//dashboard.js
  // Example data
  const cars = [
    { id: 'E138712', driver: 'Not Assigned', info: 'Mazda CX-3', type: 'Pending', status: 'pending', imgSrc: './assets/mazda.png', destination: "Nairobi" },
    { id: 'E138713', driver: 'Not Assigned', info: 'Golf-R', type: 'Pending', status: 'pending', imgSrc: './assets/golf-r.png', destination: "Kisumu" },
    { id: 'E138714', driver: 'Jane Smith', info: 'Prado TX', type: 'In Transit', status: 'in-transit', imgSrc: './assets/tx.png', destination: "Eldoret" },
    { id: 'E138715', driver: 'Alex Johnson', info: 'Audi RS6', type: 'In Delivery', status: 'in-delivery', imgSrc: './assets/rs6.png', destination: "Kitui" }
];

function generateCarList() {
    const carList = document.getElementById('car-list');
    cars.forEach(car => {
        const listItem = document.createElement('a');
        listItem.href = '#';
        listItem.className = 'list-group-item list-group-item-action d-flex align-items-center';
        listItem.dataset.carId = car.id;
        listItem.innerHTML = `
            <img src="${car.imgSrc}" alt="${car.info}" class="car-icon">
            <div>
                <h6>${car.id}</h6>
                <p>${car.info}</p>
            </div>
            <span class="badge ${car.status === 'in-delivery' ? 'status-in-delivery' : car.status === 'in-transit' ? 'status-in-transit' : 'status-in-pending'}">${car.type}</span>
        `;
        listItem.addEventListener('click', () => loadCarDetails(car));
        carList.appendChild(listItem);
    });
}

function loadCarDetails(car) {
    document.getElementById('shipping-id').textContent = car.id;
    const driverDiv = document.querySelectorAll('.card-body')[1];
    driverDiv.innerHTML = ''; // Clear the existing content
    
    // Append the new content
    driverDiv.innerHTML = `
        <div>
            <h6>Driver:</h6>
            <img src="./assets/user-profile.png" alt="shipping-icon" class="icon">
        </div>
        <button class="btn btn-link p-0 assign-button" data-bs-toggle="modal" data-bs-target="#assignModal">Assign Driver</button>
    `;
    
    document.getElementById('truck-info').textContent = car.info;
    document.getElementById('truck-destination').textContent = car.destination;

    // Update the car type input field in the modal
    document.getElementById('carType').value = car.info;
    document.getElementById('carID').value = car.id;
}

document.addEventListener('DOMContentLoaded', () => {
    generateCarList();
    if (cars.length > 0) {
        loadCarDetails(cars[0]); // Load the details of the first car
    }
});




































































