document.addEventListener("DOMContentLoaded", function() {
    const activityGrid = document.getElementById("activityGrid");
    const modal = document.getElementById("activityModal");
    const closeModal = document.querySelector(".activity-close");

    fetch("http://localhost:8080/activity/all")
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
                    modal.style.display = "block";
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

