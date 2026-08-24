import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import spotifyRoutes from "./routes/spotify.js";

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "ganti-dengan-random-string",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      httpOnly: true 
    },
  })
);

app.use("/api/spotify", spotifyRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});