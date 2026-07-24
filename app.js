const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
// Pour pouvoir utiliser les variables d'environnements
// Ne pas oublier d'installer dotenv : `npm install dotenv`
// Ensuite pour utiliser : process.env.NOM_DE_VARIABLE_DANS_ENV
require('dotenv').config()
require('./config/db')
const { sequelize, connectDB } = require('./config/database')
// Connexion à la BDD
const startServer = async () =>{
    await connectDB()

    // Créer les tables si elles n'éxistent pas
    await sequelize.sync({ alter: false })
    console.log('Tables synchronized')
}

// Import des routes
const productsRoutes = require('./routes/productsRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const userSeqRoutes = require('./routes/userSeqRoutes')


app.use(express.json())
// Si on ne met pas de paramètres, on authorise TOUS les accès
// On peut également configurer des options pour authoriser certaines ressources
const corsOption = {
    // Ce qu'on ajoute dans l'origin c'est les domaines qui sont AUTORISÉ
    origin: 'http://localhost:3000'
}
app.use(cors(corsOption))
app.use(
    helmet({
        contentsecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin'}
    })
)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { status: 429, error:  'trop de requête, réessayer plus tard.'}
})
app.use(limiter)

// Monte le routeur sur le chemin de base
app.use('/api/v1/products', productsRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v2/users', userSeqRoutes)

startServer()
app.get('/', (req, res) =>{
    res.send('Bienvenue sur mon API RESTful !')
})

app.listen(port, () => {
    // Ce console log s'affiche uniquement côté SERVEUR et non côté CLIENT
    console.log(`Serveur démarré sur http://localhost:${port}`)
})