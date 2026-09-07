<div align="center">

# 🧪 Tests & Qualité — EtuBibliothèque

### Projet 2 · Expert DevOps · OpenClassrooms

Cette page centralise les **tests unitaires**, les **tests d'intégration**, les **tests E2E** et les **rapports de couverture** du projet.

---

| Back-end | Front-end | E2E |
|:---:|:---:|:---:|
| ✅ **32 tests** | ✅ Jest | ✅ Cypress |
| ✅ **81 % JaCoCo** | ✅ **83,33 % Statements** | ✅ **8 / 8 tests** |
| ✅ 0 erreur | ✅ **81,57 % Lines** | ✅ 0 échec |

</div>

---

# 🎯 Objectif

La stratégie de test vérifie l'application à trois niveaux :

```text
Tests unitaires
      ↓
Tests d'intégration
      ↓
Tests End-to-End
```

L'objectif est de vérifier :

- la logique métier du back-end ;
- les controllers et les échanges avec la base ;
- les services et composants Angular ;
- la sécurité JWT côté front et back ;
- les principaux parcours utilisateurs ;
- une couverture de test supérieure au seuil demandé de 80 %.

---

# ☕ 1. Tests back-end

📁 [Accéder aux tests back-end](./backend/src/test/java/com/openclassrooms/etudiant/)

Technologies utilisées :

```text
JUnit 5
Mockito
MockMvc
Spring Boot Test
Testcontainers
MySQL
JaCoCo
```

---

## Tests unitaires des services

### UserService

📁 [UserServiceTest.java](./backend/src/test/java/com/openclassrooms/etudiant/service/UserServiceTest.java)

Scénarios testés :

```text
Inscription
├── utilisateur null
├── utilisateur déjà existant
└── inscription réussie

Connexion
├── connexion réussie
├── mauvais mot de passe
└── utilisateur inconnu
```

---

### StudentService

📁 [StudentServiceTest.java](./backend/src/test/java/com/openclassrooms/etudiant/service/StudentServiceTest.java)

Le CRUD est couvert :

```text
CREATE  → création d'un étudiant
READ    → liste des étudiants
READ    → recherche par ID
UPDATE  → modification
DELETE  → suppression
ERROR   → étudiant inexistant
```

---

### JwtService

📁 [JwtServiceTest.java](./backend/src/test/java/com/openclassrooms/etudiant/service/JwtServiceTest.java)

Scénarios :

```text
Génération du token
Extraction du username
Validation d'un token
Rejet d'un token pour un autre utilisateur
```

---

# 🔗 2. Tests d'intégration back-end

Les controllers sont testés avec :

```text
SpringBootTest
MockMvc
Testcontainers
MySQL 8.0.36
```

Une vraie base MySQL temporaire est lancée dans Docker pendant les tests.

---

## StudentController

📁 [StudentControllerTest.java](./backend/src/test/java/com/openclassrooms/etudiant/controller/StudentControllerTest.java)

Scénarios :

| Action | Route | Résultat attendu |
|---|---|:---:|
| Créer | `POST /api/students` | `201` |
| Lister | `GET /api/students` | `200` |
| Consulter | `GET /api/students/{id}` | `200` |
| Modifier | `PUT /api/students/{id}` | `200` |
| Supprimer | `DELETE /api/students/{id}` | `204` |
| Accès sans JWT | `/api/students` | `401` |
| Données invalides | `POST /api/students` | `400` |

---

## UserController

📁 [UserControllerTest.java](./backend/src/test/java/com/openclassrooms/etudiant/controller/UserControllerTest.java)

Scénarios :

```text
Inscription vide
Inscription déjà existante
Inscription réussie
Connexion réussie
Mauvais mot de passe
```

---

## Gestion des erreurs

📁 [RestExceptionHandlerTest.java](./backend/src/test/java/com/openclassrooms/etudiant/handler/RestExceptionHandlerTest.java)

| Exception | HTTP |
|---|:---:|
| IllegalArgumentException | 400 |
| BadCredentialsException | 401 |
| AccessDeniedException | 403 |
| RuntimeException | 500 |

---

# 📊 Couverture back-end

Le rapport a été généré avec **JaCoCo**.

### Résultat

```text
Couverture globale : 81 %
```

📁 [Rapport JaCoCo](./reports/backend-jacoco/)

📄 [index.html](./reports/backend-jacoco/index.html)

Le rapport inclut notamment :

```text
Services        → 100 %
Controllers     → 100 %
Sécurité        → 96 %
Mapper          → 91 %
```

Les classes `dto` et `entities`, principalement structurelles, sont exclues du calcul afin de concentrer la couverture sur le code exécutable.

---

# 🅰️ 3. Tests front-end avec Jest

📁 [Accéder au code front-end](./frontend/src/)

Technologies :

```text
Jest
Angular TestBed
HttpTestingController
jest.fn()
RxJS
```

---

## StudentService

📄 [student.service.spec.ts](./frontend/src/app/core/service/student.service.spec.ts)

Les appels HTTP suivants sont testés :

```text
GET    /api/students
GET    /api/students/{id}
POST   /api/students
PUT    /api/students/{id}
DELETE /api/students/{id}
```

`HttpTestingController` permet de vérifier :

```text
URL
Méthode HTTP
Body
Réponse simulée
```

Aucun vrai back-end n'est nécessaire.

---

## UserService

📄 [user.service.spec.ts](./frontend/src/app/core/service/user.service.spec.ts)

Tests :

```text
POST /api/register
POST /api/login
Body envoyé
JWT retourné
responseType = text
```

---

# 🔐 4. Tests de sécurité Angular

## Auth Guard

📄 [auth.guard.spec.ts](./frontend/src/app/core/guard/auth.guard.spec.ts)

```text
JWT présent
→ accès autorisé

JWT absent
→ redirection /login
```

---

## Auth Interceptor

📄 [auth.interceptor.spec.ts](./frontend/src/app/core/interceptor/auth.interceptor.spec.ts)

```text
JWT présent
→ Authorization: Bearer JWT_TOKEN

JWT absent
→ requête sans Authorization
```

---

# 🧩 5. Tests des composants Angular

Les composants ne sont pas uniquement testés avec `should create`.

Des comportements fonctionnels sont également vérifiés.

---

## Création d'un étudiant

📄 [student-create.component.spec.ts](./frontend/src/app/pages/student-create/student-create.component.spec.ts)

```text
Formulaire invalide
→ aucun appel au service

Formulaire valide
→ StudentService.create()

Succès
→ navigation vers /students

Erreur
→ gestion de l'erreur
```

---

## Modification d'un étudiant

📄 [student-edit.component.spec.ts](./frontend/src/app/pages/student-edit/student-edit.component.spec.ts)

```text
Lecture de l'ID dans la route
→ getById(id)

Chargement réussi
→ formulaire prérempli

Formulaire invalide
→ aucun update()

Modification réussie
→ navigation vers /students/{id}

Erreur
→ gestion de l'erreur
```

---

# 📊 Couverture front-end

Le rapport a été généré avec Jest / Istanbul.

### Résultats

| Métrique | Résultat |
|---|---:|
| Statements | **83,33 %** |
| Lines | **81,57 %** |
| Branches | 50 % |
| Functions | 56,09 % |

Le seuil demandé de **80 % minimum** est atteint.

📁 [Rapport Jest](./reports/frontend-jest/)

📄 [index.html](./reports/frontend-jest/index.html)

---

# 🌐 6. Tests End-to-End avec Cypress

📁 [Tests Cypress](./frontend/cypress/e2e/)

Les tests Cypress reproduisent les actions d'un utilisateur dans le navigateur.

Les appels API sont simulés avec :

```ts
cy.intercept()
```

Cela permet de tester le front-end sans dépendre d'un back-end ou d'une base de données démarrés.

---

## Connexion

📄 [login.cy.ts](./frontend/cypress/e2e/login.cy.ts)

```text
✅ Connexion réussie
✅ Mauvais identifiants
```

Le test vérifie notamment :

```text
Remplissage du formulaire
→ POST /api/login
→ JWT simulé
→ stockage dans localStorage
```

---

## Inscription

📄 [register.cy.ts](./frontend/cypress/e2e/register.cy.ts)

```text
✅ Inscription réussie
✅ Validation du formulaire vide
```

---

## Gestion des étudiants

📄 [students.cy.ts](./frontend/cypress/e2e/students.cy.ts)

```text
✅ Liste des étudiants
✅ Création
✅ Modification
✅ Suppression
```

Les routes mockées sont :

```text
GET    /api/students
GET    /api/students/1
POST   /api/students
PUT    /api/students/1
DELETE /api/students/1
```

---

# ✅ Résultat Cypress

```text
login.cy.ts       2 / 2
register.cy.ts    2 / 2
students.cy.ts    4 / 4

-----------------------

Total             8 / 8
Passing           8
Failing           0
```

---

# 📈 Couverture des parcours E2E

Parcours utilisateurs définis :

```text
1. Connexion réussie
2. Connexion incorrecte
3. Inscription réussie
4. Validation inscription
5. Liste étudiants
6. Création étudiant
7. Modification étudiant
8. Suppression étudiant
```

Résultat :

```text
Parcours définis : 8
Parcours couverts : 8

8 / 8 = 100 %
```

Il s'agit de la **couverture des parcours utilisateurs définis**, et non d'une couverture des lignes de code.

📄 [Rapport E2E](./frontend/cypress/reports/e2e-coverage.md)

---

# 🧾 7. Synthèse générale

| Élément | Résultat |
|---|---:|
| Tests back-end | ✅ **32** |
| Échecs back-end | ✅ **0** |
| Couverture JaCoCo | ✅ **81 %** |
| Statements Jest | ✅ **83,33 %** |
| Lines Jest | ✅ **81,57 %** |
| Tests Cypress | ✅ **8 / 8** |
| Échecs Cypress | ✅ **0** |
| Parcours E2E couverts | ✅ **100 %** |

---

# 🔎 Consulter les rapports HTML

GitHub affiche les fichiers HTML comme du code source.

Pour profiter de l'interface complète des rapports, ils peuvent être servis localement.

---

## JaCoCo

Depuis la racine du repository :

```bash
python3 -m http.server 8000 --directory reports/backend-jacoco
```

Puis ouvrir :

```text
http://localhost:8000
```

---

## Jest

```bash
python3 -m http.server 8001 --directory reports/frontend-jest
```

Puis ouvrir :

```text
http://localhost:8001
```

---

# ▶️ Commandes de validation

## Back-end

```bash
cd backend
mvn test
```

Rapport JaCoCo :

```bash
mvn clean verify
```

---

## Front-end

```bash
cd frontend
npm test -- --runInBand
```

Rapport Jest :

```bash
npm test -- --runInBand --coverage
```

---

## Cypress

Le front Angular doit être démarré.

Terminal 1 :

```bash
cd frontend
npm start
```

Terminal 2 :

```bash
cd frontend
npx cypress run
```

Résultat attendu :

```text
8 passing
0 failing
```

---

# 🛠️ Difficultés techniques rencontrées

| Problème | Cause | Solution |
|---|---|---|
| Testcontainers ne détectait pas Docker | compatibilité API Docker | configuration de docker-java |
| MySQL instable | `mysql:latest` | version fixée à `mysql:8.0.36` |
| JWT expiré | token invalide | génération d'un nouveau JWT |
| Angular `NullInjectorError` | HttpClient absent | `provideHttpClientTesting()` |
| Jest `No tests found` | mauvais chemin | vérification avec `find` |
| Cypress inaccessible | Angular non démarré | `npm start` avant Cypress |
| Rapport HTML mal chargé | ouverture directe en `file://` | serveur HTTP Python |

---

# 💡 Choix de reproductibilité

L'image :

```text
mysql:latest
```

a été remplacée par :

```text
mysql:8.0.36
```

afin d'améliorer :

```text
stabilité
reproductibilité
prédictibilité
```

Ce choix évite qu'une nouvelle version de MySQL modifie le comportement des tests sans modification du projet.

---

# 📌 Accès rapide

| Ressource | Lien |
|---|---|
| ☕ Tests back-end | [Ouvrir](./backend/src/test/java/com/openclassrooms/etudiant/) |
| 🅰️ Tests front-end | [Ouvrir](./frontend/src/) |
| 🌐 Tests Cypress | [Ouvrir](./frontend/cypress/e2e/) |
| 📊 Rapport JaCoCo | [Ouvrir](./reports/backend-jacoco/) |
| 📊 Rapport Jest | [Ouvrir](./reports/frontend-jest/) |
| 📈 Rapport E2E | [Ouvrir](./frontend/cypress/reports/e2e-coverage.md) |

---

<div align="center">

## ✅ Qualité validée

**Back-end · Front-end · Intégration · E2E**

Projet 2 — Expert DevOps · OpenClassrooms

</div>
