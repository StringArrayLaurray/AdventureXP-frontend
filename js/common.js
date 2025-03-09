// loader modal på alle sider
document.addEventListener("DOMContentLoaded", () => {
    injectModal();
});

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

function showModal() {
    const modal = document.querySelector("#factModal");
    modal.style.display = "inline-block";

    document.querySelector(".close-modal").addEventListener("click", () => {
        document.querySelector("#factModal").style.display = "none";
    })
}

document.querySelector(".logInModal").addEventListener("click", () => {
    showModal();
})

