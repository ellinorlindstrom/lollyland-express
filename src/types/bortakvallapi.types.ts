/**
 * Types for Bortakväll API
 *
 * <http://www.bortakvall.se/api/v2/products>
 */



 export interface OrderData {
  customer_first_name: string;
  customer_last_name: string;
  customer_address: string;
  customer_postcode: string;
  customer_city: string;
  customer_email: string;
  customer_phone: string;
  order_total: number;
  order_items: OrderItem[];
}

interface Tags {
    id: number
    name: string
    slug: string
}

export interface Products {
    id: number
    name: string
    price: number
    description: string
    images: {
        thumbnail: string;
        large: string;
      };
    category: string
    createdAt: string
    updatedAt: string
    on_sale: boolean
    stock_status: string
    stock_quantity: number
    tags: Tags
}

export interface CartItem {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }
export interface OrderItem 
{
  product_id: number;
  qty: number;
  item_price: number;
  item_total: number
}

export interface Customer 
{
  customer_first_name: string;
  customer_last_name: string;
  customer_address: string;
  customer_postcode: string;
  customer_city: string;
  customer_email: string;
  customer_phone: string;
}
  
  export interface Order 
  {
    order_total: number;
    order_items: OrderItem[]
  }
  
  export interface FullOrder 
  {
    customer: Customer;
    order: Order;
  }
 

  interface IOrderItem 
  {
    id: number;
    order_id: number;
    product_id: number;
    qty: number;
    item_price: number;
    item_total: number;
  }
  
  
  interface IData 
  {
    id: number;
    user_id: number;
    order_date: string;
    customer_first_name: string;
    customer_last_name: string;
    customer_address: string;
    customer_postcode: string;
    customer_city: string;
    customer_email: string;
    customer_phone: string;
    order_total: number;
    created_at: string;
    updated_at: string;
    items: IOrderItem[];
  }
  
  export interface IApiResponse 
  {
    status: string; 
    data: IData;
  }


