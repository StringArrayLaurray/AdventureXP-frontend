document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
})

function updateCartDisplay() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    cartItemsContainer.innerHTML = '';
    let total = 0;
//henter gemte varer fra localStorage. hvis der ikke findes noget der, bruges der OR-operatoren, ti at sikre, at cartItems er et tomt array fremfor null


    cartItems.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width:100px;">
            <div class="item-info">
                <p>${item.name}</p>
                <p>${item.price} kr x ${item.quantity}</p>
                <button onclick="removeItemFromCart(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price * item.quantity;
    });
//itererer ove rhvert item i cartItems. oprettes nyt div(itemElement) for hver vare. indsætter HTML til hvert produkt

    document.getElementById('totalPrice').textContent = total + ' kr';
}

function removeItemFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartDisplay();
}
//henter cartItems fra localStorage, hvor cartItems.splice(index, 1); fjerner varen med det givne index fra arrayet.

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
});
