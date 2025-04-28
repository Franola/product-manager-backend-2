const express = require("express");
const app = express();
const PORT = 8080;



app.listen(PORT, () => {
    console.log(`Servidor express escuchando en el puerto: ${PORT}`);
});