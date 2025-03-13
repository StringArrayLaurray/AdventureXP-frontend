document.addEventListener("DOMContentLoaded", function() {
    const shopGrid = document.getElementById("shopGrid");
    //først sikres det at JS ikke kører før HTML-dok er indlæst og bagefter hentes DOM med id'et shopGrid (container for shop items)

    fetch("https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/shop/all")
        .then(response => response.json())
        .then(shopItems => { //itererer over hver item i arrayet
            shopItems.forEach(item => {
                const div = document.createElement("div");
                div.classList.add("shop-item");
                //først konverteret til JSON format, bagefter itererer over hver item i arrayet,
                // bagefter oprettes der et nyt div element for hvert item der tildeles shop-item

                const imageName = item.name.toLowerCase().replace(/\s+/g, "-") + ".jpg";

                div.innerHTML = `
                   <img src="../../images/${imageName}" alt="${item.name}">
                   <h3>${item.name}</h3>
                   <p>${item.description}</p>
                   <p>${item.size}</p>
                   <p Class="price">Price: ${item.price} kr</p>
                   <input type="number" min="1" value="1">
                   <button class="add-to-cart-button">Add to cart</button>
                `;
                //div bliver fyldt med HTMLL-indhold der viser detaljer for hvert item

                shopGrid.appendChild(div); //tilføj til DOM som gør det synligt på siden

                // Tilføj event listener til 'Add to cart' knappen
                div.querySelector('.add-to-cart-button').addEventListener('click', function() {
                    console.log("Add to Cart button clicked for:", item.name);
                    addItemToCart(this.closest(".shop-item"), item);
                });
            });
        })
        .catch(error => console.error("Error fetching shop items:", error));
});

function addItemToCart(itemElement, item) {
    // Hent antallet fra inputfeltet
    const quantityInput = itemElement.querySelector('input[type="number"]');
    if (!quantityInput) return; // Afbryd hvis feltet ikke findes
    const quantity = parseInt(quantityInput.value, 10);
    if (isNaN(quantity) || quantity <= 0) return; // Afbryd hvis antal er ugyldigt

    // Hent billedet fra HTML
    const imageElement = itemElement.querySelector("img");
    if (!imageElement) return; // Afbryd hvis billedet ikke findes
    const imageSrc = imageElement.src;

    // Opret vare-objekt til kurven
    const cartItem = {
        name: item.name,
        price: item.price,
        image: imageSrc,
        quantity: quantity
    };

    addToCart(cartItem);
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Tjek om varen allerede er i kurven
    let found = cart.find(cartItem => cartItem.name === item.name);
    if (found) {
        found.quantity += item.quantity;
    } else {
        cart.push(item);
    }

    // Opdater `localStorage`
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.querySelector("#log-in-button").addEventListener("click", (event) => {
    event.preventDefault();
    changeModal(`test`, getLoginForm(), "html")
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

