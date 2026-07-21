const Product = require('../models/productModel')

// Fournir tous les produits
exports.getAllProducts = async (req, res) => {
    try {
        // Va chercher dans la BDD tout les produits
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

// Récupère un produit par son id
exports.getProductByID = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(result == null){
            return res.status(404).json({message: "Produit non trouvé"})
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

// Créer un produit 
exports.createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock
        })

        const newProduct = await product.save()
        res.status(201).json(newProduct)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}