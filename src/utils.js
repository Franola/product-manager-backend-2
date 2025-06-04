import multer from "multer";
import path from "path";
import fs from "fs";
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
const dir = "./public/img";

if (!fs.existsSync(dir)) {
  
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, "./public/img");
  },  
  filename: function (req, file, cb) {
    
    cb(null, `${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
