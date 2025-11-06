import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

const swaggerSpec = swaggerJSDoc({
  definition: { 
    openapi: "3.0.3", 
    info: { title: "Demo", version: "1.0.0" },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Identifiant unique de l'utilisateur",
              example: "123"
            },
            name: {
              type: "string",
              description: "Nom de l'utilisateur",
              example: "Utilisateur 123"
            },
            email: {
              type: "string",
              format: "email",
              description: "Adresse email de l'utilisateur",
              example: "user123@example.com"
            }
          },
          required: ["id", "name", "email"]
        },
        CreateUser: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Nom de l'utilisateur",
              example: "Alice Dupont"
            },
            email: {
              type: "string",
              format: "email",
              description: "Adresse email de l'utilisateur",
              example: "alice.dupont@example.com"
            }
          },
          required: ["name", "email"]
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Message d'erreur",
              example: "Ressource non trouvée"
            },
            code: {
              type: "integer",
              description: "Code d'erreur HTTP",
              example: 404
            },
            message: {
              type: "string",
              description: "Description détaillée de l'erreur",
              example: "L'utilisateur avec l'ID spécifié n'existe pas"
            }
          },
          required: ["error", "code"]
        }
      }
    }
  },
  apis: ["./src/**/*.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.json({ 
    message: "Bienvenue sur le serveur TypeScript + Express !",
    routes: [
      "GET / - Cette page d'accueil",
      "GET /hello - Message de salutation",
      "GET /users/:id - Récupérer un utilisateur par ID",
      "POST /users - Créer un nouvel utilisateur",
      "GET /docs - Documentation Swagger"
    ]
  });
});

/**
 * @openapi
 * /hello:
 *   get:
 *     summary: Dire bonjour
 *     parameters:
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *         description: Nom à personnaliser dans le message
 *         example: Alice
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 message: 
 *                   type: string
 *                   example: "Bonjour, Alice !"
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Paramètre invalide"
 *               code: 400
 *               message: "Le paramètre 'name' contient des caractères invalides"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Erreur interne"
 *               code: 500
 *               message: "Une erreur inattendue s'est produite"
 */

app.get("/hello", (req, res) => {
  const name = req.query.name as string;
  const message = name ? `Bonjour, ${name} !` : "Bonjour, monde !";
  res.json({ message });
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'utilisateur
 *         example: "123"
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "ID invalide"
 *               code: 400
 *               message: "L'ID doit être un nombre entier positif"
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Utilisateur non trouvé"
 *               code: 404
 *               message: "Aucun utilisateur trouvé avec l'ID 123"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Erreur interne"
 *               code: 500
 *               message: "Erreur lors de la récupération de l'utilisateur"
 */
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ 
    id: id,
    name: `Utilisateur ${id}`,
    email: `user${id}@example.com`
  });
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Données invalides"
 *               code: 400
 *               message: "Les champs name et email sont requis"
 *       409:
 *         description: Conflit - Utilisateur déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Utilisateur déjà existant"
 *               code: 409
 *               message: "Un utilisateur avec cette adresse email existe déjà"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Erreur interne"
 *               code: 500
 *               message: "Erreur lors de la création de l'utilisateur"
 */
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  
  // Validation simple
  if (!name || !email) {
    return res.status(400).json({ 
      error: "Données invalides",
      code: 400,
      message: "Les champs name et email sont requis" 
    });
  }
  
  // Générer un ID simple (dans un vrai projet, vous utiliseriez une base de données)
  const id = Math.random().toString(36).substr(2, 9);
  
  const newUser = {
    id,
    name,
    email
  };
  
  res.status(201).json(newUser);
});

app.listen(3000, () => {
  console.log("Serveur TypeScript + Express démarré !");
  console.log("http://localhost:3000/hello");
});
