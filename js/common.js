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
                    <h2 id="modalTitle">Title of the Modal</h2>
                </div>
                <div class="modal-body">
                    <p id="modalContent">Body Content of the modal</p>
                </div>
            </div>
        </div>
    `);
}

// viser modal og aktiverer X knappen
function showModal() {
    const modal = document.querySelector("#factModal");
    modal.style.display = "inline-block";

    document.querySelector(".close-modal").addEventListener("click", () => {
        document.querySelector("#factModal").style.display = "none";
    })
}

// ændrer indholdet af modal. default mode er en String,
// hvis den skal ændre indholdet til HTML skal det specificeres med "html" som 3. argument. Se getLoginForm() for eksempel.
function changeModal(title, content, mode = "text") {
    document.querySelector("#modalTitle").innerText = title;

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
    
        <button type="submit" id="login-button" class="form-button">Login</button>
    </form>
`
}

async function fetchActivities() {
    const response = await fetch(`http://localhost:8080/activity/all`);
    return await response.json();
}

async function fetchActivityById(id) {
    const response = await fetch(`http://localhost:8080/activity/${id}`);
    return response.json();
}

// login ting
// document.querySelector(".logInModal").addEventListener("click", () => {
//     changeModal("LOG IN", getLoginForm(), "html")
//     showModal();
// })

