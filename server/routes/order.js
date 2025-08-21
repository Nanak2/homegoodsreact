// routes/purchase.js
import express from 'express';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

// Find existing customer by phone
const fetchCustomerByPhone = async (phone) => {
    let { data: existingCustomer, error: findError } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .single();

    if (findError && findError.code !== "PGRST116") {
      // "PGRST116" = no rows found
      throw findError;
    }
    console.log("Inside fetch customer id:", existingCustomer);
    return existingCustomer ? existingCustomer.id: null;
}

// POST purchase
router.post("/", async (req, res) => {
    const { orderData } = req.body;
    if(!orderData) return res.status(400).json({ message: " Missing fields" });

    console.log("Order Data:", orderData.customerName);

    try {
        // Find or create customer
        let customerId = await fetchCustomerByPhone(orderData.customerPhone);
        if (!customerId) {
            // Insert New Customer
            const { data, error } = await supabase
                .from('customers')
                .insert([
                    {
                        name: orderData.customerName,
                        phone: orderData.customerPhone,
                        email: orderData.customerEmail,
                        address: orderData.deliveryStreet + ' ' + orderData.deliveryCity,
                    },
                ])
                .select('id')
                .single();
    
            if (error) return res.status(500).json({ error: error.message });
            customerId = data.id;

            console.log("Raw data response customer ID:", data.id);
        } 

        // Insert new order
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    customer_id: customerId,
                    fulfillment_method: orderData.fulfillmentMethod,
                    source: null,
                    total_amount: orderData.total,
                    item_count: orderData.cartItems.length,
                    payment_method: null,
                    delivery_notes: orderData.deliveryNotes,
                    pickup_notes: orderData.pickupNotes,
                    order_name: orderData.customerName,
                }
            ])
            .select('id')
            .single();
        
        if (error) return res.status(500).json({ error: error.message });
        const orderId = data.id;
        
        console.log("Order placed ID:", data);
        console.log("Raw data of cartItems:", orderData.cartItems.map(product => (product.id)));

        // Insert new order items
        const orderItems = orderData.cartItems.map(product => ({
            order_id: orderId,
            product_id: product.id,
            quantity: product.quantity,
            price: product.price
        }));

        const { data: order_items_id, error: findError } = await supabase
            .from('order_items')
            .insert(orderItems)
            .select('id');
        
        if (findError) {
            console.error("Insert order_items error:", findError);
            return res.status(500).json({ error: findError.message });
        }
        console.log("Response order items ID:", order_items_id);

        res.status(200).json({
            message: "Order processed successfully",
            customerId,
            orderId,
            order_items_id,
    });
        
    } catch (err) {
        console.error("Order placed error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
    
})

export default router;
