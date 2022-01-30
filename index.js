//const{express,bodyParser,multer,fs,xlsxFile,builder9} =require('./utils')
//const path= require("path")
//const express = require("express");
//const bodyParser = require("body-parser");
//const multer = require("multer");
//const fs = require("fs");
//const xlsxFile = require("read-excel-file/node");
//const builder9 = require("xmlbuilder");
const { PORT } = require("./Configuracion/Server");
const {
  express,
  bodyParser,
  multer,
  fs,
  xlsxFile,
  builder9,
  path
} = require("./utils/utils");
const indexRouter = require("./src/routes/index");

//const usersRouter = require('/src/routes/users');

const app = express();
app.use("/", indexRouter);
//app.use('/users', usersRouter);
app.use("/", express.static(__dirname + "/src/app"));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: "src/tmp" }).array("image"));

const schema = {
  LONGITUD: {
    prop: "LONGITUD",
    type: Number,
    required: true,
  },
  LATITUD: {
    prop: "LATITUD",
    type: Number,
    required: true,
  },
  NAME: {
    prop: "NAME",
    type: String,
    required: true,
  },
};

app.post("/file_upload", function (req, res) {
  const enrutamiento = req.body.enrutar;
  console.log(enrutamiento);
  //console.log(req.files[0]);
  var des_file = __dirname + "/" + req.files[0].originalname;
  fs.readFile(req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        console.log(err);
      } else {
        var response = {
          message: "",
          filename: req.files[0].originalname,
        };

        xlsxFile(__dirname + "/" + response.filename, { schema }).then(
          (vas1) => {
            //console.log(vas1.rows);
            var toy = vas1.rows.map(
              (data) =>
                `<Placemark>
                  <name>${data.NAME}</name>
                    <Point>
                      <coordinates>${data.LONGITUD},${data.LATITUD}</coordinates>
                    </Point>
                </Placemark>`
            );

            var feed = builder9
              .create(
                "kml",
                { encoding: "utf-8" },
                { xmlns: "http://www.opengis.net/kml/2.2" }
              )
              .ele("Document")
              .ele("name", "aki el nombre")
              .up()
              .raw(toy.join(""))
              .end({ pretty: true });
            console.log(feed);

            fs.writeFile("./ExcelToKML5.kml", feed, (err) => {
              if (err) throw err;
              console.log("Archivo Creado Satisfactoriamente");
            });
          }
        );
        console.log(response);
        //res.end(JSON.stringify(response));
        res.sendFile(path.join(__dirname + "/src/descargas/download.html"));
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Aplicacion en ${PORT}`);
});
