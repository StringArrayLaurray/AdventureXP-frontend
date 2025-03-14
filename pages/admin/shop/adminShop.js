const seeAllButton = document.querySelector("#see-all-button");
const addButton = document.querySelector("#add-button");
const content = document.querySelector(".p-content");

document.addEventListener("DOMContentLoaded", async () => {
    renderContent("list", await getAllShopItems());
});

seeAllButton.addEventListener("click", async () => {
    renderContent("list", await getAllShopItems());
});

addButton.addEventListener("click", () => {
    renderContent("create-form");
});

async function getAllShopItems() {
    const response = await fetch('https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/shop/all');
    if (!response.ok) {
        console.error(`Error! Status: ${response.status}`);
        return [];
    }
    return await response.json();
}

async function addShopItem(shopItem) {
    const response = await fetch('https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/shop/add', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopItem)
    });
    if (!response.ok) {
        console.error(`Failed to create shop item: ${response.status}`);
    }
    return response;
}

async function deleteShopItem(id) {
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/shop/delete/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        console.error(`Failed to delete shop item: ${response.status}`);
    }
    return response;
}

async function updateShopItem(id, updatedShopItem) {
    const response = await fetch(`https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/shop/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedShopItem)
    });
    if (!response.ok) {
        console.error(`Failed to update shop item: ${response.status}`);
    }
    return response;
}

function renderContent(type, data = null) {
    switch (type) {
        case "list":
            content.innerHTML = `<table class="shop-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Item Type</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Size</th>
                        <th>Flavor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.price} kr</td>
                            <td>${item.itemType}</td>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>${item.size}</td>
                            <td>${item.flavor}</td>
                            <td>
                                <button class="edit-shop-button" data-id="${item.shopItemsId}">Edit</button>
                                <button class="delete-shop-button" data-id="${item.shopItemsId}">Delete</button>
                            </td>
                        </tr>`).join("")}
                </tbody>
            </table>`;
            addEventListeners();
            break;

        case "create-form":
            content.innerHTML = `<form id="create-shop-item-form"><br>
                <label for="name">Item Name:</label>
                <input type="text" id="name" required><br>
                <label for="price">Price:</label>
                <input type="number" id="price" required><br>
                <label for="itemType">Item type:</label>
                <input type="text" id="itemType" required><br>
                <label for="description">Description:</label>
                <input type="text" id="description" required><br>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" required><br>
                <label for="size">Size:</label>
                <input type="text" id="size" required><br>
                <label for="flavor">Flavor:</label>
                <input type="text" id="flavor" required><br><br>
                <button type="button" id="createShopItemButton" class="more-info">Create Item</button>
            </form>`;
            document.querySelector("#createShopItemButton").addEventListener("click", async () => {
                const newItem = {
                    name: document.querySelector("#name").value,
                    price: document.querySelector("#price").value,
                    itemType: document.querySelector("#itemType").value,
                    description: document.querySelector("#description").value,
                    quantity: document.querySelector("#quantity").value,
                    size: document.querySelector("#size").value,
                    flavor: document.querySelector("#flavor").value
                };
                await addShopItem(newItem);
                renderContent("list", await getAllShopItems());
            });
            break;

        case "edit-form":
            content.innerHTML = `
               <form id="edit-shop-item-form">
                <label for="edit-name">Item Name:</label>
                <input type="text" id="edit-name" value="${data.name}" required><br>
                <label for="edit-price">Price:</label>
                <input type="number" id="edit-price" value="${data.price}" required><br>
                <label for="edit-itemType">Item type:</label>
                <input type="text" id="edit-itemType" value="${data.itemType}" required><br>
                <label for="edit-description">Description:</label>
                <input type="text" id="edit-description" value="${data.description}" required><br>
                <label for="edit-quantity">Quantity:</label>
                <input type="number" id="edit-quantity" value="${data.quantity}" required><br>
                <label for="edit-size">Size:</label>
                <input type="text" id="edit-size" value="${data.size}" required><br>
                <label for="edit-flavor">Flavor:</label>
                <input type="text" id="edit-flavor" value="${data.flavor}" required><br>
                <button type="button" id="updateShopItemButton">Update Item</button>
            </form>`;
            document.getElementById("updateShopItemButton").addEventListener('click', () => submitEdit(data.shopItemsId));
            break;
    }
}

function addEventListeners() {
    document.querySelectorAll(".delete-shop-button").forEach(button =>
        button.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            // Tilføj en bekræftelsesdialog
            if (confirm("Are you sure you want to delete this item?")) {
                const response = await deleteShopItem(id);
                if(response.ok) {
                    alert("Item has been deleted successfully.");
                    renderContent("list", await getAllShopItems());
                } else {
                    alert("Failed to delete the item.");
                    console.error(`Failed to delete shop item: ${response.status}`);
                }
            }
        }));

    document.querySelectorAll(".edit-shop-button").forEach(button =>
        button.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            const items = await getAllShopItems();
            const itemToEdit = items.find(item => item.shopItemsId === Number(id));
            if (!itemToEdit) {
                console.error("Item to edit not found for ID:", id);
                return;
            }
            renderContent("edit-form", itemToEdit);
        }));
}

async function submitEdit(id) {
    const updatedItem = {
        name: document.getElementById("edit-name").value,
        price: parseFloat(document.getElementById("edit-price").value),
        itemType: document.getElementById("edit-itemType").value,
        description: document.getElementById("edit-description").value,
        quantity: parseInt(document.getElementById("edit-quantity").value, 10),
        size: document.getElementById("edit-size").value,
        flavor: document.getElementById("edit-flavor").value
    };
    const response = await updateShopItem(id, updatedItem);
    if (response.ok) {
        renderContent("list", await getAllShopItems());
    } else {
        console.error("Failed to update the item");
    }
}
