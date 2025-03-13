// loader modal på alle sider
document.addEventListener("DOMContentLoaded", () => {
    injectModal();
});

// HTML der bliver loaded
function injectModal() {
    document.body.insertAdjacentHTML("beforeend", `
        <div id="factModal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <h2 id="modalTitle1">Title of the Modal</h2>
                </div>
                <div class="modal-body">
                    <p id="modalContent">Body Content of the modal</p>
                </div>
            </div>
        </div>
    `);

    const modal = document.querySelector("#factModal");
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            removeModal();
        }
    });
}

// viser modal og aktiverer X knappen
function showModal() {
    const modal = document.querySelector("#factModal");
    modal.style.display = "inline-block";

    document.querySelector(".close-modal").addEventListener("click", () => {
        document.querySelector("#factModal").style.display = "none";
    })
}

function removeModal() {
    const modal = document.querySelector("#factModal");
    modal.style.display = "none";
}

// ændrer indholdet af modal. default mode er en String,
// hvis den skal ændre indholdet til HTML skal det specificeres med "html" som 3. argument. Se getLoginForm() for eksempel.
function changeModal(title, content, mode = "text") {
    document.querySelector("#modalTitle1").innerText = title;

    const modalBody = document.querySelector(".modal-body");
    if (mode === "html") {
        modalBody.innerHTML = content;
    } else {
        modalBody.innerText = content;
    }
}

function getLoginForm() {
    return `
    <form id="login-form" class="modal-form">
        <label for="username">Username:</label>
        <input type="text" id="username" class="form-input" placeholder="Enter your username" required><br>
    
        <label for="password">Password:</label>
        <input type="password" id="password" class="form-input" placeholder="Enter your password" required><br>
    
        <button type="submit" id="login-button" class="modal-button">Login</button>
    </form>`
}

// fetchActivities() og fetchActivityById() bliver brugt i både adminBooking og adminActivites.
async function fetchActivities() {
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/activity/all`);
    return await response.json();
}

async function fetchActivityById(id) {
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/activity/${id}`);
    return response.json();
}

async function getLogInInfo(admin){
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(admin)

    });
    return response.json();
}
