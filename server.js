const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/database/db");

const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}`);
});