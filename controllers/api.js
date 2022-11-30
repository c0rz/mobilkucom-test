const koneksi = require("../config/database");
var sharp = require("sharp");

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

exports.create = (req, res) => {
  const data = req.body;

  sharp(process.cwd() + "/public/process_images/" + req.file.filename)
    .resize(500)
    .toFile(process.cwd() + "/public/process_images/preview_" + req.file.filename);

  const querySql =
    "INSERT INTO `users`(`full_name`, `bod`, `age`, `city`, `last_education`, `pict`) VALUES ('" +
    data.name +
    "','" +
    convert(data.date) +
    "','" +
    data.usia +
    "','" +
    data.city +
    "','" +
    data.education +
    "','/public/process_images/preview_" +
    req.file.filename +
    "')";
  koneksi.query(querySql, function (err, result) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal insert data!", error: err });
    }

    res.status(200).json({
      success: true,
      message: "Success insert.",
    });
  });
};

exports.view = (req, res) => {
  let sql;
  if (req.params.id) {
    sql = "select * from users where id = " + req.params.id;
  } else {
    sql = "select * from users";
  }
  koneksi.query(sql, (err, rows, fields) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        data: rows,
      });
    } else console.log(err);
  });
};

exports.update = (req, res) => {
  const data = req.body;

  sharp(process.cwd() + "/public/process_images/" + req.file.filename)
    .resize(1000)
    .toFile(process.cwd() + "/public/process_images/preview_" + req.file.filename);

  const querySql =
    "UPDATE `users` SET `full_name`='" +
    data.name +
    "',`bod`='" +
    convert(data.date) +
    "',`age`='" +
    data.usia +
    "',`city`='" +
    data.city +
    "',`last_education`='" +
    data.education +
    "',`pict`='/public/process_images/preview_" +
    req.file.filename +
    "' WHERE id = " +
    req.params.id;
  koneksi.query(querySql, function (err, result) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal update data!", error: err });
    }
    res.status(200).json({
      success: true,
      message: "Success update.",
    });
  });
};
