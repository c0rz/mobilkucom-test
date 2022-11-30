const express = require("express");
const bodyParser = require("body-parser");
const controllers = require("./controllers/api");
const app = express();
const multer = require("multer");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/process_images");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

app.put("/api/:id", cors(), upload.single("image"), controllers.update);
app.post("/api/create", cors(), upload.single("image"), controllers.create);

app.get("/api/", cors(), controllers.view);
app.get("/api/:id", cors(), controllers.view);

app.listen(3300, () => console.log(`Server running at port: 3300`));
