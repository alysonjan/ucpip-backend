"use strict";
// backend/src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://ucpip-frontend-production.up.railway.app",
    ], // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    credentials: true, // Allow sending cookies and credentials if needed
}));
app.use(express_1.default.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../out")));
// Serve static files from the "public" folder
app.use("/pdfs", express_1.default.static(path_1.default.join(__dirname, "../public/pdfs")));
// app.use("/signatures", express.static(path.join(__dirname, "../public/signatures")));
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});
app.use("/api", (0, routes_1.default)());
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
