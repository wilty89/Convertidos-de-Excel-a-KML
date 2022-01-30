var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/hola', function(req, res, next) {
  res.send('<strong>hola</strong>');
  
});
router.get("/download", function (req, res) {
  var file = "./ExcelToKML5.kml";
  res.download(file);
});
router.get("/090", function (req, res) {
  res.status(404).send("recurso no encontrado");
});
module.exports = router;
