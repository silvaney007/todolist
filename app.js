//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const workItems = [];

const ItemsSchema = {
  name: String,
}

const Item = mongoose.model('Item', ItemsSchema);


app.get("/", function (req, res) {

  const day = date.getDate();

  Item.find({}, function (err, foundItems) {
    res.render("list", { listTitle: day, newListItems: foundItems });
  })


});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({ name: itemName });
  item.save();

  res.redirect("/");

});

app.post("/delete", function (req, res) {

  const itemRemove = req.body.checkbox;

  Item.findByIdAndDelete(itemRemove, function (err) {
    if (!err) {
      res.redirect("/");

    }

  })

});


app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
