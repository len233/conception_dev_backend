import express from "express";

const app = express();

app.get("/hello", (_req, res) => {
  res.json({ message: "Bonjour, monde !" });
});

app.listen(3000, () => {
  console.log("Serveur TypeScript + Express démarré !");
  console.log("http://localhost:3000/hello");
});
