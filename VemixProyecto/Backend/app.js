const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postBoxRoutes = require("./routes/postBoxRoutes");
const virtualAddressRoutes = require("./routes/virtualAddressRoutes");
const packageRoutes = require("./routes/packageRoutes");
require("dotenv").config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(bodyParser.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/postboxes", postBoxRoutes);
app.use("/api/virtualaddresses", virtualAddressRoutes);
app.use("/api/packages", packageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
