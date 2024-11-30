const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const client = require("./config/database");
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config();
const port = process.env.PORT;


// Cookie middleware configuration
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true  // Enable cookies with CORS
}));

// Cookie default options
app.use((req, res, next) => {
  res.cookie('options', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  });
  next();
});


app.use(express.static("public"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const routes = require("./routes");
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
