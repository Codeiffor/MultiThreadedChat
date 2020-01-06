import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import router from "./routes/index";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", router);
app.use(errorHandler);

const clientBuildPath = path.join(__dirname, "../client/build");
const clientBaseFile = path.join(clientBuildPath, "index.html");
app.use(express.static(clientBuildPath));
app.get("*", (req, res) => {
  res.sendFile(clientBaseFile);
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
