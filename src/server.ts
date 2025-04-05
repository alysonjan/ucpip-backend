// backend/src/server.ts

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ucpip-frontend-production.up.railway.app",
    ], // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    credentials: true, // Allow sending cookies and credentials if needed
  })
);

app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../out")));

// Serve static files from the "public" folder
app.use("/pdfs", express.static(path.join(__dirname, "../public/pdfs")));
// app.use("/signatures", express.static(path.join(__dirname, "../public/signatures")));

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!" });
});

app.use("/api", routes());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
