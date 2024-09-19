const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const helmet = require("helmet");
const path = require("path");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

// const { verifyJWTMiddleware } = require("./src/middlewares/authMiddleware");
const globalErrorHandler = require("./src/controllers/errorController");

const userRoutes = require("./src/routes/userRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const googleDocsRoutes = require("./src/routes/googleDocsRoutes");
const verifyGoogleAuth = require("./src/middlewares/verifyGoogleTokenMiddleware");

const AppError = require("./src/helpers/errorHelper");

const app = express();
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
/**
 ** @desc GLOBAL MIDDLEWARES
 */
// Implement CORS
// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.options("http://localhost:3000", cors(corsOptions));

app.use(cors());
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
// app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Data sanitization against XSS
app.use(xss());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime);
  next();
});

/**
 ** @desc ROUTES
 */
app.use("/api/v1/googledocs", verifyGoogleAuth, googleDocsRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/courses", courseRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

const port = process.env.PORT || 3001;
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/**
 ** @desc GLOBAL ERROR HANDLER
 */
app.use(globalErrorHandler);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err, err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});

