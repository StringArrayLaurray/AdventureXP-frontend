document.addEventListener("DOMContentLoaded", async function () {
    // henter elementer fra DOM'en
    const businessBookingCheckbox = document.getElementById("businessBooking");
    const activitySelect1 = document.getElementById("activitySelect1");
    const activitySelect2 = document.getElementById("activitySelect2");
    const activitySelect3 = document.getElementById("activitySelect3");
    const extraActivitiesDiv = document.getElementById("extraActivities");

    // de ekstra dropdowns er ikke krævede fra start
    activitySelect2.required = false;
    activitySelect3.required = false;

    // henter URL-parametre for at se om en aktivitet er valgt på forhånd
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedActivity = urlParams.get("activity");

    // funktion til at hente aktiviteter fra backend
    async function fetchActivities() {
        try {
            const response = await fetch("https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/activity/all");
            const activities = await response.json();

            activities.forEach(activity => {
                // opretter options til dropdowns
                const option1 = document.createElement("option");
                option1.value = activity.name;
                option1.textContent = activity.name;

                // vælger en aktivitet automatisk, hvis den er givet i URL'en
                if (activity.name === preselectedActivity) {
                    option1.selected = true;
                }

                activitySelect1.appendChild(option1);

                const option2 = option1.cloneNode(true);
                activitySelect2.appendChild(option2);

                const option3 = option1.cloneNode(true);
                activitySelect3.appendChild(option3);
            });

        } catch (error) {
            console.error("fejl ved hentning af aktiviteter:", error);
        }
    }

    await fetchActivities();

    // event listener til business booking checkboxen
    businessBookingCheckbox.addEventListener("change", function () {
        if (businessBookingCheckbox.checked) {
            // viser de ekstra dropdowns og gør dem krævede
            extraActivitiesDiv.style.display = "block";
            activitySelect2.required = true;
            activitySelect3.required = true;
        } else {
            // skjuler de ekstra dropdowns og gør dem ikke krævede
            extraActivitiesDiv.style.display = "none";
            activitySelect2.required = false;
            activitySelect3.required = false;
        }
    });

    // håndterer formular-indsendelse
    document.getElementById("bookingForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // forhindrer side-reload

        // samler valgte aktiviteter
        const selectedActivities = [activitySelect1.value];
        if (businessBookingCheckbox.checked) {
            if (activitySelect2.value) selectedActivities.push(activitySelect2.value);
            if (activitySelect3.value) selectedActivities.push(activitySelect3.value);
        }

        // henter deltager-navne fra input og splitter ved komma
        const participantsInput = document.getElementById("participants").value;
        const participantsArray = participantsInput.split(",")
            .map(name => name.trim()) // fjerner mellemrum
            .filter(name => name.length > 0); // fjerner tomme værdier

        // opretter booking-objekt
        const formData = {
            isBusinessBooking: businessBookingCheckbox.checked,
            activities: selectedActivities.map(activityName => ({ name: activityName })), // konverterer aktiviteter til objekter
            participants: participantsArray, // liste af deltagernavne
            date: document.getElementById("date").value,
            time: document.getElementById("time").value
        };

        console.log("📤 sender booking data:", formData);

        try {
            // sender booking data til backend
            const response = await fetch("https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/bookings/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("✅ booking bekræftet!");
                window.location.replace("/AdventureXP-frontend/pages/activities/activities.html"); // redirect til activities
            } else {
                const errorMessage = await response.text();
                console.error("fejl fra serveren:", errorMessage);
                alert("fejl: booking kunne ikke gennemføres.");
            }
        } catch (error) {
            console.error("fejl ved forbindelse til serveren:", error);
            alert("der opstod en fejl. tjek din internetforbindelse.");
        }
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
});