// routes/products.js
import express from 'express';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
    console.log("Fetching products...");
    try {
        // Fetch all products from the 'products' table
        const { data, error } = await supabase
            .from('products')
            .select('*');

        //console.log('Category:', category);
        if (error) return res.status(500).json({ error: error.message });
        console.log("Response server:", data);
        res.json(data);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }

});

// GET a category id
router.get('/:categorySlug', async (req, res) => {
    try {
        // Fetch category id
        const { categorySlug } = req.params;
        console.log('Fetching products for category:', categorySlug);
        const { data, error } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categorySlug);
        if (error) return res.status(500).json({ error: error.message });
        // Debug logs
        console.log('Raw data response:', data);
        console.log('Data type:', typeof data);
        console.log('Data length:', data ? data.length : 'data is null/undefined');
        
        res.json(data);
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
});

export default router;

