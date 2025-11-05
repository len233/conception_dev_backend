import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();

const swaggerSpec = swaggerJSDoc({
  definition: { 
    openapi: "3.0.3", 
    info: { title: "Demo", version: "1.0.0" },
    servers: [{ url: "http://localhost:3000" }] 
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *                 name:
 *                   type: string
 *                   example: "Utilisateur 123"
 */
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ 
    id: id,
    name: `Utilisateur ${id}`
  });
});

app.listen(3000, () => {
  console.log("Serveur TypeScript + Express démarré !");
  console.log("http://localhost:3000/hello");
});
