import express from 'express';
import supabase from '../config/supabaseClient.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
    try {
        // Fetch all products from the 'products' table
        const { data, error } = await supabase
            .from('products')
            .select('*');

        //console.log('Category:', category);
        if (error) return res.status(500).json({ error: error.message });
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
        //console.log('Fetched category data id:', data);
        res.json(data);
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
});

export default router;

