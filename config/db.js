const mongoose = require('mongoose')


const dbURI = process.env.MONGODB_URI

mongoose.connect(dbURI)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(err => console.error("Erreur de connexion à MongoDB :", err))

// Si vous n'intégrer pas le code dans app.js, on fait l'export
module.exports = mongoose.connection