import { h2El, orderPage } from "../checkout";
import { IApiResponse } from "../types/bortakvallapi.types";
const API_URL = "https://www.bortakvall.se/api/v2/users/35/orders";
export const sendOrder = async (e: Event, orderData: object) => {
  e.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      alert(
        `Failed to send order! ${response.status} - ${response.statusText} Please try again later...`
      );
      console.error(`Error: ${response.status} - ${response.statusText}`);
      throw new Error(`Failed to send order. Status: ${response.status}`);
    }

    const responseData: IApiResponse = await response.json();

    // Varibel för att visa order_id på order-confirmation sidan
    const orderId = responseData.data.items[0].order_id;
    h2El.textContent = `Tack för din beställning!`;
    orderPage.innerHTML = `
        <h3 style="font-family: 'nunitobold'; color: #574531; text-align: center;">Ditt ordernummer är: #${orderId}</h3>
        </br>
        <img style="max-width: 500px; width: 100%; padding:1 rem;" src="lollyland-img/giphy.gif" 
    ">
      `;
      localStorage.clear();
    // return responseData;
  } catch (error) {
    console.error("Error sending the order:", error);
    throw error;
  }
};


/* 
  The cat is sad coz it got a merge conflict
　　　　　／＞　　フ
　　　　　| 　_　 _
　 　　　／` ミ＿xノ
　　 　 /　　　 　|
　　　 /　 ヽ　　ﾉ
　 　 │　　| | |
 */
