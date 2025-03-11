const content = document.querySelector(".content");

// buttons
const seeAllButton = document.querySelector("#see-activities-button");
const editButton = document.querySelector("#edit-activities-button");
const deleteButton = document.querySelector("#delete-activity-button");
const addButton = document.querySelector("#add-activity-button");

document.addEventListener("DOMContentLoaded", () => {
    listContent(fetchActivities);
});

content.addEventListener("click", async (event) => {
    if (event.target.classList.contains("activity-link")) {

        const activityId = event.target.dataset.id;
        const activity = await fetchActivityById(activityId);

        if (document.querySelector("#edit-activity-form")) {
            renderContent("form", activity);
        } else {
            renderContent("details", activity);
        }
    }
})

editButton.addEventListener("click", async () => {
    listContent(fetchActivities).then(() => {
        let h2 =  document.createElement("h2");
        h2.innerText = "Choose activity to edit: ";
        h2.classList.add("edit-heading");
        content.prepend(h2);
    });


    content.addEventListener("click", async (event) => {
        if (event.target.classList.contains("activity-link")) {
            const activityId = event.target.dataset.id;
            const activity = await fetchActivityById(activityId);

            renderContent("form", activity);

            content.querySelector("#activity-name").value = activity.name;
            content.querySelector("#activity-description").value = activity.description;
            content.querySelector("#activity-minAge").value = activity.minAge;
            content.querySelector("#activity-duration").value = activity.duration;
            content.querySelector("#activity-height").value = activity.minHeight;
        }

    }, { once: true })

})

seeAllButton.addEventListener("click", () => {
    listContent(fetchActivities);
});

function renderContent(type, data) {

    switch (type) {
        case "list":
            content.innerHTML = `<ul>` + data.map(activity => `
            <li>
                <a href="#" class="activity-link" data-id="${activity.id}">
                    ${activity.name}
                </a>
            </li>`
            ).join("") + `</ul>`;
            break;

        case "details":
            content.innerHTML = `
            <h2>${data.name}</h2>
            <p>${data.description}</p>
            <p>Minimum age: ${data.minAge}</p>
            <p>Duration: ${data.duration}</p>
            <p>Minimum Height: ${data.minHeight}</p>
            <button class="more-info" id="delete-activity-button">Delete</button>`;
            break;

        case "form":
            content.innerHTML = `
            <form id="edit-activity-form">
                <label for="activity-name">Name:</label>
                <input type="text" id="activity-name" name="name" required><br>
            
                <label for="activity-description">Description:</label>
                <textarea id="activity-description" name="description" required></textarea><br>
            
                <label for="activity-minAge">Minimum Age:</label>
                <input type="number" id="activity-minAge" name="minAge" required><br>
            
                <label for="activity-duration">Duration:</label>
                <input type="number" id="activity-duration" name="duration" required><br>
            
                <label for="activity-height">Minimum Height:</label>
                <input type="number" id="activity-height" name="minHeight" required><br>
            
                <button type="button" id="saveEditButton">Save Changes</button>
            </form>`;

            const saveButton = document.querySelector("#saveEditButton");

            // fjerner alle eventlisteners fra tidligere clicks.
            const newSaveButton = saveButton.cloneNode(true);
            saveButton.replaceWith(newSaveButton);

            // tilføjer ny eventlistener
            newSaveButton.addEventListener("click", () => {
                const activityToSave = {
                    name: document.querySelector("#activity-name").value,
                    description: document.querySelector("#activity-description").value,
                    minAge: document.querySelector("#activity-minAge").value,
                    duration: document.querySelector("#activity-duration").value,
                    minHeight: document.querySelector("#activity-height").value
                };
                console.log(activityToSave);
                updateActivityById(data.id, activityToSave);
            });
            break;
    }
}

async function listContent(fetchFunction){
    const data = await fetchFunction();
    renderContent("list", data)
}

async function fetchActivities() {
    const response = await fetch(`http://localhost:8080/activity/all`);
    return await response.json();
}

async function fetchActivityById(id) {
    const response = await fetch(`http://localhost:8080/activity/${id}`);
    return response.json();
}

async function updateActivityById(id, activity) {
    const response = await fetch(`http://localhost:8080/activity/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity)
    });

    if (!response.ok) {
        throw new Error(`Failed to update activity: ${response.status}`);
    }

    return await response.json();
}