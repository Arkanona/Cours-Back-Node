# API ResFul avec Node.js et Express

## 1. Qu'est-ce qu'un API ?
Une API (Application Porgramming Interface) est un  ensemble de règles qui permet à deux logiciels de communiquer entre eux. Elles définit **comment** un client peut demander des données ou des actions à un serveur, et **comment** ce dernier doit répondre.

**analogie du restaurant :**
Le client ne va pas en cuisine préparer son plat. Il passe commande auprès du serveur (l'API), qui transmet la demande à la cuisine (le backend) et rapporte le plat (la réponse).

Dans le développement web, l'API est le pont entre le front-end (ce que voit l'utilisateur) et le back-end (la base de données, la logique métier).

## 2. Qu'est-ce que REST ?

REST (*Representational State Transfer*) est un style d'architecture défini par Roy Fielding en 2000. Ce n'est **pas** une technologie ou un protocole, mais un ensemble de principes à respecter pour concevoir une API cohérente et scalable.

### Les 6 contraintes REST
| # | Contraintes |En résumé |
|---|------------|----------|
| 1 | Client-Serveur | Le front et le back sont séparé et évoluent indépendamment |
| 2 | Sans état (*stateless*) | Chaque requête contient toute les infos nécéssaires : le serveur ne mémorise rien entre deux requêtes |
| 3 | Cacheable | Les réponse indiquent si elles peuvent être mises en cache |
| 4 | Interface uniforme | Les ressources sont identifiées par des URL, manipulées via des représentations (JSON...) |
| 5 | Système en couches | Le client ignore s'il parle au serveur final ou à un proxy/load balancer |
| 6 | Code à la demande *(optionnel)* | Le serveur peut envoyer du code exécutable au client |

### Une API RESTful, concrètement 

* Une **ressource** = une entité métier (un produit, un utilisateur...), identifiée par une URI.
* On nomme les URI avec des **noms**, jamais des verbes :
    * ✅ `GET /api/products`
    * ❌ `GET /api/getAllProducts`
* Les actions (créer/lire/modifier/supprimer) sont portées par le **verbe HTTP**, pas par l'URI

### Verbes HTTP → CRUD

| Verbe HTTP | Action CRUD | Exemple |
|------------|-------------|---------|
| GET | Read | `GET /api/products/123` |
| POST | Create | `POST /api/products` |
| PUT | Update (remplacement complet) | `PUT /api/products/123` |
| PATCH | Update (modification partielle) | `PATCH /api/products/123` |
| DELETE | Delete | `DELETE /api/products/123` |

### Code de statut HTTP à connaitre

* **2xx - Succès** : `200 OK`, `201 Created`, `204 No Content`
* **4xx - Erreur client** : `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
* **5xx - Erreur serveur** : `500 Internal Server Error`

---

## 3. Node.js et Express.js

### Node.js
Un environnement d'exécution JavaScript **côté serveur**, basé sur le moteur V8 de Chrome. Il permet d'utiliser le même langage (JS) sur le front et le back, et gère efficacement de nombreuses connexions simultanées grâce à son modèle asynchrone non bloquant.

### Express.js
Un framework web minimaliste pour Node.js. Il facilite :
* La définition de routes HTTP,
* L'utilisation de middlewares,
* La connexion à une base de données,
* L'envoi de réponse (JSON, HTML, ...)

---

## 4. Mettre en place un serveur Express

### Étape 1 - Initialiser le projet
```bash
npm init -y
```
script dans package.json permet de faire des raccourcis clavier pour le npm


### Étape 2 - Installer Express
```bash
npm install express # ou
npm i express
```
créer le fichier node module (on peut faire .gitignore et mettre le nom dans le gitignore(node_modules))

### Étape 3 - Créer le fichier `app.js`
```javascript
const express = require('express')
const app = express()
const port = 3000

//      URL
app.get('/', (req, res) =>{
    res.send('Bienvenue sur mon API RESTful !')
})

app.listen(port, () => {
    // Ce console log s'affiche uniquement côté SERVEUR et non côté CLIENT
    console.log(`Serveur démarré sur http://localhost:${port}`)
})
```

### Étape 4 - Lancer le serveur
```bash
node app.js # ou
nodemon app.js # préféré l'utilisation de celui-ci
```
Pour lancer le serveur avec nodemon, vous devez l'installer avec `npm install -g nodemon`.
Lancer le serveur avec nodemon permet de recharger automatiquement le sevreur à chaque changement dans vos fichiers, un peu comme fait l'extension Live Server.

Vous pouvez ouvrir `http://localhost:3000` dans le navigateur.

### Organiser le code avec `express.Router()`
Pour ne pas tout entasser dans `app.js`, on sépare les routes par ressource :

```javascript
// routes/users.js
const express = require('express')
const route = express.Router()

router.get('/', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Lucas'
        },
        {
            id: 2,
            name: 'Gabriel'
        }
    ])
})
// Quand on veut passer un paramètre dans l'url on utilise :nomDuParamètre
router.get('/:id', (req, res) => {
    res.send(`Détailles de l'utilisateur : ${req.params.id}`)
})

// Très important pour pouvoir l'utiliser
module.exports = router
```


```javascript
// app.js
const userRoutes = require('./routes/users.js')

app.use('/api/v1/users', userRoutes)
```

### Architecture recommandée (MVC simplifié)

```
mon-api/
├── app.js
├── routes/         → définit les endpoints, dirige vers les contrôleurs
├── controllers/    → logique métier, prépare la réponse
├── middlewares/    → s'exécute avant la route finale
└── models/         → schéma des données, interaction avec la BDD
```

## 5. Les middlewares

Un middleware est une fonction qui a accès à `req`, `res`, et à `next()`(permet d'aller à l'étape suivante). Elle s'exécute **avant** que la requête n'atteigne sa route finale, et peut:
* lire ou modifier `req` et `res`
* arrêter la requête en renvoyant une réponse
* ou la laisser continuer en appelant `next()`.

Avec les middlewares vous pouvez tester l'authentification, faire une middleware de gestion d'erreurs, de log, etc.

Les middlewares s'executent **dans l'ordre où ils sont déclarés** avec `app.use()`.

### Exemple 1 - Middleware de journalisation
```javascript
const express = require('express')
const app = express()

//Middleware global : s'applique à toutes les requêtes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next() //indispensable : pass la main à la suite
})

app.get('/', req, res) => {
    res.send('Accueil')
}

app.listen(3000)
```

### Exemple 2 - Middlewares intégrés à Express (parsing du body)
```javascript
app.use(express.json())                         // parse les requêtes JSON
app.use(express.urlencoded({extended: true}))   //parse les form classiques

app.post('/data', (req, res) => {
    console.log(req.body) //accessible uniquement grâce au middleware ci-dessous
    res.send('Données reçues')
})
```

### Exemple 3 - Middleware d'authentification simple (sur une route précise)
Un middleware peutêtre global (`app.use`) ou appliquer à une seule route, en le passant comme argument avan le handler final:

```javascript
function checkToken(req, res, next) {
    const token = req.headers['authorization']
    
    if(!token){
        return res.status(401).json({message: 'Accès refusé : token manquant'})
    }
    
    //On intègre la logique de vérification du token
    next() // token valide, on continue vers la route
}

//Au niveau de la route concernée
//On applique le middleware à une route spécifique
router.delete('/:id', checkToken, productController.deleteProduct)
```

**Point clé :** si `next()` n'est jamais appelé (et qu'aucune réponse n'est envoyée), la requête reste bloquée indéfinement côté client

## 6. L'authentification
Afin de gérer un système d'authentification vous allez avoir besoin de deux choses :
* **bcrypt :** Pour hasher les mot de passe utilisateur
* **jsonwebtoken :** Pour gérer les jetons d'authentification

Les jetons d'authentification (token) peuvent être encodés avec une durée spécifique ainsi qu'avec des informations supplémentaires. Généralement on y ajoute l'id de l'utilisateur.

### Instalation des packages
```bash
npm install bcryptjs jsonwebtoken
```

### Les CORS
**Cross Origin Ressource Sharing :**
C'est le fait d'autoriser ou non l'accès à des ressources depuis un endroit précis. Si on fait un fetch à un serveur distant mais que les CORS ne sont pas bien paramétré, back refuser l'accès, donc pas de données.
On peut les configurer si on à une API publique, on peut définir différente adresse authorisé. On doit installer le plugins CORS `npm install cors`.
Ils se configurents sur le `app.js`. Ajouter en haut du fichier `app.js` la ligne `const cors = require('cors')`.
```javascript
const corsOption = {
    origin: 'http://localhost:3000'
}
app.use(cors(corsOption))
```
Si les CORS sont bien configurer, même si quelqu'un arrive à avoir les accès de notre API, il ne pourra rien en faire.
On peut mettre les liens dans un Array pour en autorisé plusieurs. Ce qu'on ajoute dans l'origin c'est les domaines qui sont AUTORISÉ.

### Helmet
Il permet de définir différent headers, il permet de masquer et de configurer certaine informations à différents attaquant et donc ça permet de vous protéger de faille XSS.
Pour l'installer `npm install helmet`.
Ajouter ensuite dans le fichier `app.js`.
```javascript
const helmet = require('helmet')
```
La configuration recommandée pour une API REST
```javascript
app.use(
    helmet({
        // La CSP (Content Security Policy)
        // Pour une API purement JSON, on désactive la CSP
        helmet.contentsecurityPolicy: false,
        // Si votre API intéragit avec d'autres domaines
        crossOriginRessourcePolicy: { policy: "cross-origin" }
    })
)
```
**Helmet est un middleware qui configure automatiquement 15 en-tête HTTP pour sécuriser votre serveur Express :**
**X-Powered-By (Masqué) :** Supprime l'en tête `X-Powered By: Express` pour ne pas révéler votre stack.
**Strict-Transport-Security (HSTS) :** Force les navigateurs à se connecter uniquement en HTTPS
**X-Frame-Options :** Empêche votre site d'être intégré dans un `<frame>` ou `<iframe>`, protection contre le clickjacking
**X-Content-Type-Options :** Force le navigateur à respecter le type MEME déclaré pour éviter l'exécution de scripts malveillants
**X-XSS-Protection :** Active le filtre XSS sur les navigateurs plus anciens.

### Expres Rate Limit
C'est un midddleware qui permet de limiter le nombre d'appels a votre API, par minutes, par IP. En faisant ça, ça permet d'éviter les attaques par brute force. 
`npm install express-rate-limit`
```javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes,
    limit: 100, // Max 100 requête par IP cur ce créneau
    message: { status: 429, error: 'Trop de requête, réessayez plus tard.'}
})

app.use(limiter) // A afficher après le Helmet et le CORS
```

### Validator
Permet de faire des vérifications sur votre mot de passe, sans devoir passer par des regex.
`npm install validator`
On va s'en servir pour principalement l'email et le mot de passe.
A l'endroit ou on va s'en servir on fait appel a validator.
Exemple sur `authController.js` :
```javascript
const validator = require('validator')

const isPasswordOK = validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
}) // Return sois true sois false

if(!isPassOK){
    return res.status(400).json({ message: 'Password must have 1 lower, 1 upper, 1 number, and 1 symbol and must be at least 6 characters long'})
}

// Vérifier si c'est un mail
const isEmailOK = validator.isEmail(email)

if(!isEmailOK){
    return res.status(400).json({ message: 'You must provide a valid email' })
}
```