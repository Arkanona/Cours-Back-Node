const express = require('express')
const app = express()
const port = 3000
// Pour pouvoir utiliser les variables d'environnements
// Ne pas oublier d'installer dotenv : `npm install dotenv`
// Ensuite pour utiliser : process.env.NOM_DE_VARIABLE_DANS_ENV
require('dotenv').config()
require('./config/db')

// Import des routes
const productsRoutes = require('./routes/products')


app.use(express.json())

// Monte le routeur sur le chemin de base
app.use('/api/v1/products', productsRoutes)

app.get('/', (req, res) =>{
    res.send('Bienvenue sur mon API RESTful !')
})

app.listen(port, () => {
    // Ce console log s'affiche uniquement côté SERVEUR et non côté CLIENT
    console.log(`Serveur démarré sur http://localhost:${port}`)
})