activitiesButton = document.querySelector("#activities-button");
bookingsButton = document.querySelector("#bookings-button");
employeesButton = document.querySelector("#employees-button");

activitiesButton.addEventListener("click", () => {
    window.location.href = "activities/adminActivities.html";
})

bookingsButton.addEventListener("click", () => {
    window.location.href = "adminBooking.html";
})

employeesButton.addEventListener("click", () => {
    window.location.href = "adminEmployees.html";
})