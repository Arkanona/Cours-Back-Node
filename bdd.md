# Le principe de Modèle
Les modèles sont des représentation des données de votre application et de la logique métier associée. Ils sont responsable de  l'interaction avec la base de données (création, lecture, mise à jour, suppression des données) et de la validation des données. Dans une application Node avec MongoDB, Mongoose est couramment utilisé pour définir les schémas de données et intéragir avec la base de données, agissant ainsi comme la couche modèle.

**Exemple de modèle avec Mongoose :**
/!\ ATTENTION : Pour utiliser mongoose, il faut l'installer avec `npm install mongoose`

```javascript
// models/productModel.js
const mongoose = require('mongoose')

const productSchema = new mangoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema)
```

# Manipulation de BDD avec MangoDB et Mongoose
## Introduction à MongoDB
MongoDB est une base de données NoSQL (Not Only SQL) orientée document, ce qui signifie qu'elle stocke les données sous forme de documens BSON (Binary JSON) avec des schémas flexibles.
Contrairement au base de données relationnelles traditionnelles qui utilisent des tables et des lignes, MongoDB utilise des collections et des documents. Cette flexibilité en fait un excellent choix pour les applications qui nécessitent une évolutivité rapide et la gestion de données non structurée ou semi-structurée.

**Concepts clés MongoDB :**
* **Document :** L'unité de base de données dans MongoDB. Un document est un ensemble de paires clé-valeur, similaire à un objet JSON. Les documents peuvent avoir des structure différentes au sein de la même collection.
* **Collection :** Un groupe de documents. L'équivalent d'une table dans une base de données relationnelle. Une collection ne force pas de schéma stricte sur ses documents.
* **Base de données :** Un conteneur pour les collections. Un serveur MongoDB peut héberger plusieurs base de données.

**Avantages de MongoDB :**
* **Flexibilité des schémas :** Permet de stocker des documents avec des structures différentes dans la même collection, ce qui facilite l'évolution des applications.
* **Hautes performance :** Conçu pour la vitesse et l'évolutivité, capable de gérer de grands volumes de données et de requêtes.
* **Scalabilité horizontale :** Facile à mettre à l'échelle en distribuant les données sur plusieurs serveurs (sharding).
* **Richesse des requêtes :** Supporte des requêtes complexes, l'indexation et l'agrégation de données.

/!\ Comme avec MySQL, vous pouvez utiliser MongoDB soit en local, soit depuis un hébergement ATLAS (site MongoDB)

## Introduction à Mongoose
Mongoose est une bibliothèque ODM (Object Data Modeling) pour MongoDB et Node. Elle fournit une solution basée sur des schémas pour modéliser les données de votre application, ce qui simplifie les interactions avec la base de données. Mongoose gère les relations entre les données, fournit une validation de schéma et est largement utilisé pour la modélisation d'objets MongoDB dans un envrionnement asynchrone.

**Pourquoi utiliser Mongoose ?**
* **Validation de schéma :** Mongoose vous permet de définir des schémas pour vos documents, garantissant que les données stockées dans MongoDB respectent une structure définie et des règles de validation.
* **Modélisation des données :** Facilite la création de modèles JavaScript qui correspondent à vos collections MongoDB, permettant d'interagire avec la base de données en utilisant des objets JavaScript.
* **Middlewares :** Permet d'exécuter des fonctions avant ou après certaines opérations de base de données (par exemple, avant de sauvegarder un document).

## Connexion à MongoDB avec Mongoose
Pour connecter votre application Node à une base de données MongoDb en utilisant Mongoose, vous devez d'abord installer Mongoose :
```bash
npm install mongoose
```

Ensuite, dans votre fichier `app.js` (ou un fichier de configuration de base de données séparé) :
```javascript
// app.js ou /config/db.js
const mongoose = require('mongoose')

                                    // User    : pass > Tout le reste ne doit pas être touché
const dbURI = "mongodb://mongodb://back2026:back2026@ac-cvvzwwb-shard-00-00.2yefr5x.mongodb.net:27017,ac-cvvzwwb-shard-00-01.2yefr5x.mongodb.net:27017,ac-cvvzwwb-shard-00-02.2yefr5x.mongodb.net:27017/?ssl=true&replicaSet=atlas-v6896o-shard-0&authSource=admin&appName=CoursBackNode" 


mongoose.connect(dbURI)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(err => console.error("Erreur de connexion à MongoDB :", err))

// Si vous n'intégrer pas le code dans app.js, on fait l'export
module.exports = mongoose.connection

// Dans app.js, juste AVANT le premier app.use, intégrer avec :
// require('./config/db')
// Si votre fichier s'appelle db.js et se trouve dans le dossier config
```