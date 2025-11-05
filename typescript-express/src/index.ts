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

app.listen(3000, () => {
  console.log("Serveur TypeScript + Express démarré !");
  console.log("http://localhost:3000/hello");
});
