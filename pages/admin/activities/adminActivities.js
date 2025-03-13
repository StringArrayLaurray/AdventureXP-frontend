const content = document.querySelector(".content");

// buttons
const seeAllButton = document.querySelector("#see-activities-button");
const addButton = document.querySelector("#add-activity-button");

document.addEventListener("DOMContentLoaded", async () => {
    await listContent(fetchActivities);
});

content.addEventListener("click", async (event) => {
    if (event.target.classList.contains("activity-link")) {

        const activityId = event.target.dataset.id;
        const activity = await fetchActivityById(activityId);

        renderContent("details", activity)
    }
})

seeAllButton.addEventListener("click", async () => {
    await listContent(fetchActivities);
});

addButton.addEventListener("click", () => {
    renderContent("add");
})

async function listContent(fetchFunction){
    const data = await fetchFunction();
    renderContent("list", data)

    let h2 =  document.createElement("h2");
    h2.innerText = "All activities:";
    h2.classList.add("see-all-heading");
    content.prepend(h2);
}

async function fetchActivityById(id) {
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/activity/${id}`);
    return response.json();
}

async function updateActivityById(id, activity) {
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/activity/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity)
    });

    if (!response.ok) {
        throw new Error(`Failed to update activity: ${response.status}`);
    }

    return await response.json();
}

async function addActivity(activityToSave){
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/activity/add`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(activityToSave)
    });

    if (!response.ok) {
        throw new Error(`Failed to create activity: ${response.status}`);
    }

    return await response.json();
}

async function deleteActivity(id){
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/activity/delete/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`Failed to delete activity: ${response.status}`);
    }

    if (response.status === 204) return;

    return await response.json();
}

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
            changeModal(
                `${data.name}`,
                `<p>${data.description}</p>
                         <p>Minimum age: ${data.minAge}</p>
                         <p>Duration: ${data.duration}</p>
                         <p>Minimum Height: ${data.minHeight}</p>
                         <button class="more-info" id="delete-activity-button">Delete</button>
                         <button class="more-info" id="edit-activity-button">Edit</button>`,
                "html"
            );
            showModal();

            setTimeout(() => {
                const deleteButton = document.querySelector("#delete-activity-button");
                if (deleteButton) {
                    deleteButton.addEventListener("click", async () => {
                        deleteActivity(data.id)
                            .then(() => {
                                listContent(fetchActivities);
                                removeModal();
                            })
                            .catch(error => {
                                alert("Error deleting activity: " + error);
                                console.log("Error deleting activity:", error);
                            });
                    });
                }
            }, 50);

            setTimeout(() => {
                const editButton = document.querySelector("#edit-activity-button");
                if (editButton) {
                    editButton.addEventListener("click", () => {
                        changeModal(
                            `Edit activity`,
                            `<form id="edit-activity-form">
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
                    
                        <button type="button" class="more-info" id="saveEditButton">Save Changes</button>
                        </form>`,
                            "html"
                        );

                        document.querySelector("#activity-name").value = data.name;
                        document.querySelector("#activity-description").value = data.description;
                        document.querySelector("#activity-minAge").value = data.minAge;
                        document.querySelector("#activity-duration").value = data.duration;
                        document.querySelector("#activity-height").value = data.minHeight;

                        document.querySelector("#saveEditButton").addEventListener("click", async () => {
                            const updatedActivity = {
                                id: data.id,
                                name: document.querySelector("#activity-name").value,
                                description: document.querySelector("#activity-description").value,
                                minAge: document.querySelector("#activity-minAge").value,
                                duration: document.querySelector("#activity-duration").value,
                                minHeight: document.querySelector("#activity-height").value
                            };

                            updateActivityById(data.id, updatedActivity)
                                .then(() => {
                                    listContent(fetchActivities);
                                    removeModal();
                                })
                                .catch(error => {
                                    alert("Error updating activity: " + error);
                                    console.log("Error updating activity:", error);
                                });
                        });
                    });
                }
            }, 50);
            break;

        case "add":
            content.innerHTML = `
            <form id="add-activity-form">
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
            
                <button type="button" id="saveNewActivityButton">Save Changes</button>
            </form>`;

            const saveNewActivityButton = document.querySelector("#saveNewActivityButton");
            saveNewActivityButton.addEventListener("click",async () => {
                const newActivityToSave = {
                    name: document.querySelector("#activity-name").value,
                    description: document.querySelector("#activity-description").value,
                    minAge: document.querySelector("#activity-minAge").value,
                    duration: document.querySelector("#activity-duration").value,
                    minHeight: document.querySelector("#activity-height").value,
                }
                await addActivity(newActivityToSave);
            })
            break;
    }
}
