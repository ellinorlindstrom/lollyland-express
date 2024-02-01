/**
 * Bortakväll API
 *
 * 
GET	http://www.bortakvall.se/api/v2/products	Get all products
GET	http://www.bortakvall.se/api/v2/products/6545	Get a single product

POST	http://www.bortakvall.se/api/v2/users/35/orders	Place an order
 */


const API_URL = 'https://www.bortakvall.se/api/v2/products'

export const getProducts = async () => { 
    const response = await fetch(API_URL)

    const data = await response.json();
    console.log("arr of data:", data)

    if (!response.ok) {
        throw new Error(response.statusText)
    
    }


    return data
}

getProducts()

