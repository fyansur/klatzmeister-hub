import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import spotifyRoutes from "./routes/spotify.js";

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ganti-dengan-random-string",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);
app.use("/api/spotify", spotifyRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});