let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  multer = require("multer"),
  crypto = require("crypto"),
  xlsxtojson = require("xlsx-to-json"),
  xlstojson = require("xls-to-json");
const fs = require('fs')
const path = require("path");
let fileExtension = require("file-extension");
const converter = require("json-2-csv");
const updateUserDetails = require("./updateUserDetails");

const viewPath = path.join(__dirname, "./template/views");
const publicDirectoryPath = path.join(__dirname, "../public");
// const csv = require("csvtojson");
const updateAttributeDetails = require("./updateAttributeDetails");
app.use(express.static(publicDirectoryPath));
app.set("view engine", "hbs");
app.set("views", viewPath);
app.use(bodyParser.json());
var files = fs.readdirSync(__dirname + "/input");
// let storage = multer.diskStorage({
//   //multers disk storage settings
//   destination: function (req, file, cb) {
//     cb(null, "./input/");
//   },
//   filename: function (req, file, cb) {
//     crypto.pseudoRandomBytes(16, function (err, raw) {
//       cb(
//         null,
//         raw.toString("hex") + Date.now() + "." + fileExtension(file.mimetype)
//       );
//     });
//   },
// });

//let upload = multer({ storage: storage }).single("file");

/** Method to handle the form submit */

app.post("/sendFile", function (req, res) {
  let excel2json;
  let storage = multer.diskStorage({
    //multers disk storage settings
    destination: function (req, file, cb) {
      cb(null, "./input/");
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(
          null,
          raw.toString("hex") + Date.now() + "." + fileExtension(file.mimetype)
        );
      });
    },
  });
  fs.readdir(__dirname + "/input", (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(__dirname + "/input", file), err => {
        if (err) throw err;
      });
    }
  });
  fs.readdir(__dirname + "/output", (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(__dirname + "/output", file), err => {
        if (err) throw err;
      });
    }
  });
  let upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 401, err_desc: err });
      return;
    }
    if (!req.file) {
      res.json({ error_code: 404, err_desc: "File not found!" });
      return;
    }

    if (
      req.file.originalname.split(".")[
      req.file.originalname.split(".").length - 1
      ] === "xlsx"
    ) {
      excel2json = xlsxtojson;
    } else {
      excel2json = xlstojson;
    }

    //  code to convert excel data to json  format
    excel2json(
      {
        input: req.file.path,
        output: "output/output.json", // output json
        lowerCaseHeaders: true,
      },
      function (err, result) {
        if (err) {
          res.json(err);
        } else {
          let jsonArray = updateUserDetails(result);

          // convert JSON array to CSV string
          converter.json2csv(jsonArray, (err, csv) => {
            if (err) {
              throw err;
            }

            // print CSV string
            //console.log(csv);
            res.setHeader(
              "Content-disposition",
              `attachment; filename=${req.file.originalname.split(".")[0]}.csv`
            );
            res.set("Content-Type", "text/csv");
            res.status(200).send(csv);
            //res.send(csv);
          });
        }
      }
    );
  });
});
app.post('/updateFile', (req, res) => {
  console.log("san")
  let storage = multer.diskStorage({
    //multers disk storage settings
    destination: function (req, file, cb) {
      cb(null, "./input1/");
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(
          null,
          raw.toString("hex") + Date.now() + "." + fileExtension(file.mimetype)
        );
      });
    },
  });


  let excel2json;
  fs.readdir(__dirname + "/input1", (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(__dirname + "/input1", file), err => {
        if (err) throw err;
      });
    }
  });
  //console.log("After file delete")
  let upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 401, err_desc: err });
      return;
    }
    if (!req.file) {
      res.json({ error_code: 404, err_desc: "File not found!" });
      return;
    }

    if (
      req.file.originalname.split(".")[
      req.file.originalname.split(".").length - 1
      ] === "xlsx"
    ) {
      console.log("xlsxtojson")
      excel2json = xlsxtojson;
    } else {
      console.log("xlstojson")
      excel2json = xlstojson;
    }

    //  code to convert excel data to json  format
    excel2json(
      {
        input: req.file.path,
        output: "output1/output.json", // output json
        lowerCaseHeaders: true,
      },
      function (err, result) {
        if (err) {
          res.json(err);
        } else {
          let jsonArray;
          try {
            jsonArray= updateAttributeDetails(result, require('./output/output.json'));
          }
          catch (e) {
           return res.status(404).send({ error: "UM_USER file is not present" })
          }
          if (!jsonArray) return res.status(404).send({ error: "UM_USER file is not present" })
          // convert JSON array to CSV string
          converter.json2csv(jsonArray, (err, csv) => {
            if (err) {
              throw err;
            }

            // print CSV string
            //console.log(csv);
            res.setHeader(
              "Content-disposition",
              `attachment; filename=${req.file.originalname.split(".")[0]}.csv`
            );
            res.set("Content-Type", "text/csv");
            res.status(200).send(csv);
            //res.send(csv);
          });
        }
      }
    );
  });

})

// load index file to upload file on http://localhost:3000/
app.get("/", function (req, res) {
  res.render("index");
});

app.listen("3000", function () {
  console.log("Server running on port 3000");
});
