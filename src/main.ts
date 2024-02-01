import "/style.css";
import { getProducts } from "./services/bortakvallapi";
import { Products } from "./types/bortakvallapi.types";
import { CartItem } from "./types/bortakvallapi.types";

const shoppingcart = document.getElementById("card");
const shoppingcartList = document.getElementById("listCart");
const btn = document.getElementById("toggle-button");
const redclosebtn = document.getElementById("closebtn");
const checkOutPage = document.getElementById("pay");
const productsList = document.getElementById("products-list")!;
const headerLogo = document.querySelector<HTMLImageElement>(".header-logo");
const candyCountContainer = document.querySelector<HTMLDivElement>(
  ".candy-count-container"
)!;

headerLogo?.addEventListener("click", () => {
  window.location.href = "index.html";
});
// show product count on top of page
const renderCandyAmount = async () => {
  const candyData = await getProducts();
  const productCount = candyData.data.length;
  const productsInStock: number = candyData.data.filter(
    (product: Products) => product.stock_status === "instock"
  ).length;
  const productCountContainer = document.createElement("p");
  productCountContainer.classList.add("product-count-container");
  productCountContainer.innerHTML = `Visar ${productCount} produkter, varav ${productsInStock} i lager.`;
  candyCountContainer.appendChild(productCountContainer);
};
renderCandyAmount();

if (shoppingcart != null && btn != null) {
  btn.addEventListener("click", function handleClick() {
    if (shoppingcart.classList.contains("hidden")) {
      shoppingcart.classList.remove("hidden");
    }
  });
}

if (shoppingcart != null && redclosebtn != null) {
  redclosebtn.addEventListener("click", function handleRedCloseClick() {
    if (!shoppingcart.classList.contains("hidden")) {
      shoppingcart.classList.add("hidden");
    }
  });
}

if (checkOutPage != null) {
  checkOutPage.addEventListener("click", function () {
    window.location.href = "check-out.html";
  });
}

//declaring global variables
let addToCartBtn: HTMLButtonElement;
//declaring baseUrl as a global variable
const baseUrl = "https://www.bortakvall.se";
let cartQuantityElement = document.getElementById("quantity")!;
let currentQuantity = parseInt(cartQuantityElement.innerText);

const renderThumbnails = async () => {
  try {
    const candyData = await getProducts();
    candyData.data.sort((a: Products, b: Products) =>
      a.name.localeCompare(b.name)
    );

    if (candyData && Array.isArray(candyData.data)) {
      candyData.data.forEach(async (product: Products) => {
        // Creating new div for each product
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");
        const imgElement = document.createElement("img");

        imgElement.src = baseUrl + product.images.thumbnail;
        imgElement.alt = "candy thumbnail";
        imgElement.classList.add("thumbnail");
        imageContainer.appendChild(imgElement);

        // Creating elements for the name and price
        const nameElement = document.createElement("p");
        nameElement.textContent = product.name;
        nameElement.classList.add("product-name");
        imageContainer.appendChild(nameElement);

        const priceElement = document.createElement("p");
        priceElement.textContent = `${product.price}kr`;
        priceElement.classList.add("product-price");
        imageContainer.appendChild(priceElement);

        const stockStatus = document.createElement("p");
        stockStatus.textContent =
          product.stock_status === "outofstock" ? "Out of Stock" : "In Stock";
        stockStatus.classList.add("stock-status");
        imageContainer.appendChild(stockStatus);

        //Creating element for add-to-cart button
        addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "KÖP";
        addToCartBtn.classList.add("addToCartBtnClass");
        imageContainer.appendChild(addToCartBtn);

        // Disable the button if the product is out of stock
        if (product.stock_status === "outofstock") {
          addToCartBtn.classList.add("out-of-stock-btn");
          addToCartBtn.disabled = true;
        }

        if (product.stock_status === "instock") {
          stockStatus.classList.add("in-stock");
        } else {
          stockStatus.classList.add("out-of-stock");
        }

        const moreInfo = document.createElement("p");
        moreInfo.innerHTML = `<a href="#"> i </a>`;
        moreInfo.classList.add("more-info");
        imageContainer.appendChild(moreInfo);

        //Enlarges images and shows more information on click.
        moreInfo.addEventListener("click", () => {
          const popupOverlay = document.createElement("div");
          popupOverlay.classList.add("popup-overlay");
          document.body.appendChild(popupOverlay);

          const popupWrapper = document.createElement("div");
          popupWrapper.classList.add("popup-wrapper");
          document.body.appendChild(popupWrapper);
          popupOverlay.style.display = "block";
          document.body.style.overflow = "hidden";

          const contentContainer = document.createElement("div");
          contentContainer.classList.add("content-container");
          popupWrapper.appendChild(contentContainer);
          const popupClose = document.createElement("p");
          popupClose.classList.add("popup-close");
          popupClose.innerHTML = "X";
          contentContainer.appendChild(popupClose);

          const popup = document.createElement("img");
          popup.classList.add("popup");
          popup.src = baseUrl + product.images.large;
          popup.alt = "enlarged product";
          contentContainer.appendChild(popup);

          const popupText = document.createElement("p");
          const individualProductsInStock =
            product.stock_quantity > 0
              ? `I Lager (${product.stock_quantity} kvar)`
              : "Slut i Lager";
          popupText.innerHTML = `<strong>${product.name}</strong><br> ${individualProductsInStock} <br><strong> Pris:</strong> ${product.price}kr <br> ${product.description}`;

          popupText.classList.add("popup-text");
          contentContainer.appendChild(popupText);

          popupClose.addEventListener("click", () => {
            popupWrapper.style.visibility = "hidden";
            popupOverlay.style.display = "none";
            document.body.style.overflow = "auto";
          });
        });

        productsList.appendChild(imageContainer);

        // Function to handle the "Add to Cart" button click
        const handleBuyClick = () => {
          const productName = product.name;

          // Retrieving existing cart-items from localStorage
          const storedCart = localStorage.getItem("cart");
          const cartItems = storedCart ? JSON.parse(storedCart) : [];

          // Check if the product already exists in the cart
          const existingCartItem = cartItems.find(
            (item: CartItem) => item.name === productName
          );

          if (existingCartItem) {
            existingCartItem.quantity += 1;
          } else {
            const cartItem = {
              id: product.id,
              name: productName,
              price: product.price,
              quantity: 1,
              image: baseUrl + product.images.thumbnail,
            };

            cartItems.push(cartItem);
          }

          // Saving the updated cart back to localStorage
          localStorage.setItem("cart", JSON.stringify(cartItems));

          updateTotalPrice();
          loadCartItems();
        };

        addToCartBtn.addEventListener("click", handleBuyClick);
      });
    } else {
      console.error("productsList not found in the DOM");
    }
  } catch (error) {
    console.error("Error rendering thumbnails", error);
  }
};

renderThumbnails();

const updateTotalPrice = () => {
  const storedCart = localStorage.getItem("cart");
  const cartItems = storedCart ? JSON.parse(storedCart) : [];

  const totalPrice = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0
  );

  const totalElement = document.getElementById("totalPrice");
  if (totalElement) {
    totalElement.innerText = `Total: ${totalPrice} kr`;
  }
};

// Function to load cart items from local storage
const loadCartItems = () => {
  const storedCart = localStorage.getItem("cart");
  const cartItems = storedCart ? JSON.parse(storedCart) : [];

  if (shoppingcartList !== null) {
    shoppingcartList.innerHTML = "";
  } else {
    console.error("shoppingcartList is null");
  }

  // Update the cart quantity and total price
  currentQuantity = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );
  cartQuantityElement.innerText = currentQuantity.toString();

  updateTotalPrice();

  // Render each item in the cart
  cartItems.forEach((item: CartItem) => {
    const cartListItem = document.createElement("li");
    cartListItem.classList.add("cartListItem");

    const removeButton = document.createElement("button");
    removeButton.innerText = "x";
    removeButton.classList.add("removeButton");
    removeButton.addEventListener("click", () => removeProduct(item.name));
    cartListItem.appendChild(removeButton);

    const cartImage = document.createElement("img");
    cartImage.src = item.image;
    cartImage.alt = "candy cart image";
    cartImage.classList.add("cartImg");

    const cartTextContent = document.createTextNode(
      `${item.quantity}st ${item.name} ${item.price * item.quantity} kr`
    );

    function removeProduct(productName: string) {
      const productIndex = cartItems.findIndex(
        (product: { name: string }) => product.name === productName
      );

      if (productIndex !== -1) {
        cartItems.splice(productIndex, 1);

        // Uppdatera local storage
        localStorage.setItem("cart", JSON.stringify(cartItems));

        updateTotalPrice();
        loadCartItems();
      }
    }

    cartListItem.appendChild(cartImage);
    cartListItem.appendChild(cartTextContent);
    shoppingcartList?.appendChild(cartListItem);
  });
};

window.addEventListener("load", () => {
  loadCartItems();
});
