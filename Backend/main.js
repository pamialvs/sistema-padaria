const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/", authRoutes);

app.listen(3000, () => {
  console.log("Backend rodando na porta 3000");
});

