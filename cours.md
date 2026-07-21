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