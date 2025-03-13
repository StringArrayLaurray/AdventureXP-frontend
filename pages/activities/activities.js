document.addEventListener("DOMContentLoaded", function() {
    const activityGrid = document.getElementById("activityGrid");
    const modal = document.getElementById("activityModal");
    const closeModal = document.querySelector(".activity-close");

    fetch("https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/activity/all")
        .then(response => response.json())
        .then(activities => {
            activities.forEach(activity => {
                const div = document.createElement("div");
                div.classList.add("activity-item");

                const imageName = activity.name.toLowerCase().replace(/\s+/g, "-") + ".jpg";

                div.innerHTML = `
                   <img src="../../images/${imageName}" alt="${activity.name}">
                    <h3>${activity.name}</h3>
                `;

                div.addEventListener("click", () => {
                    document.getElementById("modalTitle").textContent = activity.name;
                    document.getElementById("modalMinAge").textContent = activity.minAge;
                    document.getElementById("modalDuration").textContent = activity.duration;
                    document.getElementById("modalMinHeight").textContent = activity.minHeight;
                    document.getElementById("modalDescription").textContent = activity.description;
                    modal.style.display = "block";

                    document.getElementById("bookActivityButton").onclick = function () {
                        window.location.href = "/pages/bookings/booking-form.html";


                    };
                });

                activityGrid.appendChild(div);
            });
        })
        .catch(error => console.error("Error fetching activities:", error));

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });


});

document.querySelector("#log-in-button").addEventListener("click", (event) => {
    event.preventDefault();
    changeModal(`LOG IN`, getLoginForm(), "html")
    showModal();

    document.querySelector("#login-button").addEventListener("click", async (event) => {
        event.preventDefault();
        //const admin = {
        //    username: document.querySelector("#username").value,
        //    password: document.querySelector("#password").value
        //}
        //await getLogInInfo(admin);
        window.location.href = "../admin/adminLanding.html";
    })
})