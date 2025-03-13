activitiesButton = document.querySelector("#activities-button");
bookingsButton = document.querySelector("#bookings-button");
employeesButton = document.querySelector("#employees-button");
shopButton = document.querySelector("#shop-button");

activitiesButton.addEventListener("click", () => {
    window.location.href = "/pages/admin/activity/adminActivities.html";
})

bookingsButton.addEventListener("click", () => {
    window.location.href = "/pages/admin/booking/adminBooking.html";
})

employeesButton.addEventListener("click", () => {
    window.location.href = "/pages/admin/employee/adminEmployees.html";
})

shopButton.addEventListener("click", () => {
    window.location.href = "/pages/admin/shop/adminShop.html";
})

