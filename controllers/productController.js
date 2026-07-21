// Fournir tous les produits
const products = 
  [
    {
        id: 1,
        name: "Huhu",
        price: 12.5,
        stock: 2
    },
    {
        id: 2,
        name: "Hoho",
        price: 13.5,
        stock: 12
    }
]
exports.getAllProducts = async (req, res) => {
    try {

        res.json(products)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

exports.getProductById = async (req, res) => {
    try {
        const result = products.find(product => product.id == req.params.id)
        if(result == null){
            return res.status(404).json({message: "Produit non trouvé"})
        }
        res.json(result)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}