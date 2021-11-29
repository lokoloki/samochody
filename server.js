var hbs = require("express-handlebars");
var express = require("express");
var app = express();
const PORT = 3000;

var path = require("path");

const Datastore = require("nedb");

const coll1 = new Datastore({
  filename: "form1.db",
  autoload: true,
});

app.get("/", function (req, res) {
  coll1.find({}, function (err, docs) {
    res.render("index.hbs", { data: docs });
  });
});

app.get("/handleForm", function (req, res) {
  let obj = {
    a: req.query.ch1 == "on" ? "TAK" : "NIE",
    b: req.query.ch2 == "on" ? "TAK" : "NIE",
    c: req.query.ch3 == "on" ? "TAK" : "NIE",
    d: req.query.ch4 == "on" ? "TAK" : "NIE",
  };

  coll1.insert(obj, function (err, newDoc) {});

  coll1.find({}, function (err, docs) {
    res.render("index.hbs", { data: docs });
  });
});

app.get("/edit", function (req, res) {
  toEdit = req.query.editR;

  const options = ["TAK", "NIE", "BRAK"];

  coll1.find({}, function (err, docs) {
    res.render("index.hbs", { data: docs, options: options });
  });
});

app.get("/delete", function (req, res) {
  toEdit = "";
  let toDelete = req.query.deleteR;
  let deleteConfirm = true;

  if (deleteConfirm) {
    coll1.remove({ _id: toDelete }, {}, function (err, numRemoved) {});
  }

  coll1.find({}, function (err, docs) {
    res.redirect("/");
  });
});

app.get("/update", function (req, res) {

  toEdit = "";
  let update = {
    a: req.query.editedA,
    b: req.query.editedB,
    c: req.query.editedC,
    d: req.query.editedD,
  };


  coll1.update({ _id: req.query.updateR }, { $set: update }, {}, function (err, numUpdated) {
       console.log("zaktualizowano " + numUpdated)
    });

    coll1.find({}, function (err, docs) {
      res.redirect("/");
    });

});

app.get("/cancel", function (req, res) {
  toEdit = "";
  coll1.find({}, function (err, docs) {
    res.redirect("/");
  });
});
let toEdit;
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  hbs({
    defaultLayout: "main.hbs",
    helpers: {
      editHelp: function (id) {
        return id == toEdit ? true : false;
      },
    },
  })
);
app.set("view engine", "hbs");

app.use(express.static("static"));

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
