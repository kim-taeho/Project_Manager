import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { localsMiddleware } from "./middleware";
import routes from "./routers/routes";
import userRouter from "./routers/userRouter";
import globalRouter from "./routers/globalRouter";
import projectRouter from "./routers/projectRouter";
import goalRouter from "./routers/goalRouter";
import marketRouter from "./routers/marketRouter";
import events from "./events";
import "./passport";

const app = express();
const CookieStore = MongoStore(session);

app.use(helmet());
app.set("view engine", "pug");
app.use("/static", express.static("static"));
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore( { mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.project, projectRouter);
app.use(routes.market, marketRouter);
app.use(routes.goal, goalRouter);

export default app;