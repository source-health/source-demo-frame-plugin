import express, { Request, Response } from "express";

const app = express();
const port = 3000;

// Serve static files from public/
app.use(express.static("public"));
app.use(express.static("dist"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
