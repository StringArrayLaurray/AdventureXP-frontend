activitiesButton = document.querySelector("#activities-button");
bookingsButton = document.querySelector("#bookings-button");
employeesButton = document.querySelector("#employees-button");

activitiesButton.addEventListener("click", async () => {
    const data = await fetchActivities();

    let content = `
    <table>
        ${data.map(activity => 
        `<tr>
            <td>${activity.id}</td>
            <td>${activity.name}</td>
        </tr>`
         ).join("")}
    </table>`;

    changeModal("Activities", content, "html")

    showModal();
})

bookingsButton.addEventListener("click", () => {

})

employeesButton.addEventListener("click", () => {

})

async function fetchActivities() {
    const response = await fetch(`http://localhost:8080/activity/all`);
    return await response.json();
}

