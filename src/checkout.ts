import "/style.css";
import { sendOrder } from "./services/order";
import { CartItem } from "./types/bortakvallapi.types";
import { OrderData  } from "./types/bortakvallapi.types";

const checkoutContainer = document.querySelector("#checkoutContainer");

export const orderPage = document.querySelector(
  ".checkout-el"
) as HTMLDivElement;

export const h2El = document.querySelector(".title-h2") as HTMLDivElement;

// Hämta produkter från local storage
const cartItemsString = localStorage.getItem("cart");

// Decodning of JSON-string
export const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];

// Makes an object-structure
const productMap: {
  [key: string]: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
} = {};

// Process each product and adds to the object structure
cartItems.forEach(
  (product: { id: number; name: string; price: number; image: string }) => {
    const key = product.name;

    if (productMap[key]) {
      productMap[key].quantity += 1;
      productMap[key].price += product.price;
    } else {
      productMap[key] = { ...product, quantity: 1 };
    }
  }
);

// Render products to checkoutContainer.
if (checkoutContainer) {
  checkoutContainer.innerHTML = "";

  const productList = document.createElement("ul");
  productList.style.listStyleType = "none";

  Object.values(productMap).forEach((product) => {
    const listItem = document.createElement("li");

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.classList.add("productImage");

    listItem.appendChild(productImage);

    listItem.innerHTML += `${product.name} - ${product.quantity}st - ${product.price}kr`;

    const removeButton = document.createElement("button");
    removeButton.innerText = "x";
    removeButton.classList.add("removeButton");
    removeButton.addEventListener("click", () => removeProduct(product.name));
    listItem.appendChild(removeButton);

    productList.appendChild(listItem);
  });

  //checkoutContainer.appendChild(productList);
}

function removeProduct(productName: string) {
  const productIndex = cartItems.findIndex(
    (product: { name: string }) => product.name === productName
  );

  if (productIndex !== -1) {
    cartItems.splice(productIndex, 1);

    // Update local storage
    localStorage.setItem("cart", JSON.stringify(cartItems));

    updateTotalPrice();
    renderCheckout();
  }
}

function renderCheckout() {
  checkoutContainer!.innerHTML = "";

  const productList = document.createElement("ul");
  productList.style.listStyleType = "none";

  const storedCart = localStorage.getItem("cart");
  const cartItems = storedCart ? JSON.parse(storedCart) : [];

  let totalPrice = 0;

  cartItems.forEach((cartItem: CartItem) => {
    const listItem = document.createElement("li");

    // Hitta motsvarande produkt i productMap
    const productMapKey = cartItem.name;
    const product = productMap[productMapKey];

    // Skapa en bildtagg och sätt bild
    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.classList.add("productImage");
    // Lägg till bildtaggen i listelementet
    listItem.appendChild(productImage);

    // Lägg till textinformation i listelementet inklusive kvantitet
    listItem.innerHTML += `${product.name} - ${cartItem.quantity}st - ${
      product.price * cartItem.quantity
    }kr`;

    // Min removeBtn
    const removeButton = document.createElement("button");
    removeButton.innerText = "x";
    removeButton.classList.add("removeButton");
    removeButton.addEventListener("click", () => removeProduct(product.name));
    listItem.appendChild(removeButton);

    productList.appendChild(listItem);

    totalPrice += product.price * cartItem.quantity;
  });

  checkoutContainer!.appendChild(productList);

  // Update total price in DOM.
  const totalPriceElement = document.createElement("div");
  totalPriceElement.classList.add("totalPriceCheckout");
  totalPriceElement.innerText = `Total: ${totalPrice} kr`;
  checkoutContainer!.appendChild(totalPriceElement);
}

window.onload = () => {
  renderCheckout();
};
// Function to calculate and display the total price.
const updateTotalPrice = () => {
  const storedCart = localStorage.getItem("cart");
  const cartItems = storedCart ? JSON.parse(storedCart) : [];

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.price,
    0
  );
  return totalPrice;
};

updateTotalPrice();

// Function to calculate and return the total quantity
const calculateTotalQuantity = () => {
  const storedCart = localStorage.getItem("cart");
  const cartItems = storedCart ? JSON.parse(storedCart) : [];

  // Calculate total quantity
  return cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0
  );
};

//Function to get the total quantity
export const totalQuantity = calculateTotalQuantity();
calculateTotalQuantity();

function validateForm(e: Event): Promise<void> {
  return new Promise(async (resolve) => {
    e.preventDefault();
    const firstName =
      document.querySelector<HTMLInputElement>("#input-firstName")?.value;
    const lastName =
      document.querySelector<HTMLInputElement>("#input-lastName")?.value;
    const address =
      document.querySelector<HTMLInputElement>("#input-address")?.value;
    const postCode =
      document.querySelector<HTMLInputElement>("#input-zipcode")?.value;
    const city = document.querySelector<HTMLInputElement>("#input-city")?.value;
    const email =
      document.querySelector<HTMLInputElement>("#input-email")?.value;
    const phone =
      document.querySelector<HTMLInputElement>("#input-phone")?.value;

    if (
      firstName &&
      lastName &&
      address &&
      postCode &&
      postCode.length < 6 &&
      city &&
      email &&
      email.includes("@")
    ) {
   
      const orderData: OrderData = {
        customer_first_name: `${firstName}`,
        customer_last_name: `${lastName}`,
        customer_address: `${address}`,
        customer_postcode: `${postCode}`,
        customer_city: `${city}`,
        customer_email: `${email}`,
        customer_phone: `${phone}`,
        order_total: totalQuantity,
        order_items: orderItems,
      };


      sendOrder(e, orderData);
    } else {
      alert("Please fill in all required fields correctly.🐍");
    }
  

    resolve();
  });
}

//Creates new object to meet the format to send to server.
export const orderItems: {
  product_id: number;
  qty: number;
  item_price: number;
  item_total: number;
}[] = [];

//Push selected product values to orderItems.
cartItems.forEach((cartItem: any) => {
  const productMapKey = cartItem.name;
  const product = productMap[productMapKey];

  orderItems.push({
    product_id: product.id,
    qty: cartItem.quantity,
    item_price: product.price,
    item_total: product.price * cartItem.quantity,
  });
});

document.querySelector("#submit-order")?.addEventListener("click", (event) => {
  event.preventDefault();
  validateForm(event);
});
