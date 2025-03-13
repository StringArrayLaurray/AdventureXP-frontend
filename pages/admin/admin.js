activitiesButton = document.querySelector("#activities-button");
bookingsButton = document.querySelector("#bookings-button");
employeesButton = document.querySelector("#employees-button");
shopButton = document.querySelector("#shop-button");

activitiesButton.addEventListener("click", () => {
    window.location.href = "/AdventureXP-frontend/pages/admin/activities.html";
})

bookingsButton.addEventListener("click", () => {
    window.location.href = "/AdventureXP-frontend/pages/admin/booking/adminBooking.html";
})

employeesButton.addEventListener("click", () => {
    window.location.href = "/AdventureXP-frontend/pages/admin/employee/adminEmployees.html";
})

shopButton.addEventListener("click", () => {
    window.location.href = "/AdventureXP-frontend/pages/admin/shop/adminShop.html";
})

