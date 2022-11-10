let bodyParser = require("body-parser");
let mongoose = require("mongoose");
const url = require("url");

mongoose.connect(
  "mongodb+srv://Pips:123Ivan123@todo.5mhwyfe.mongodb.net/?retryWrites=true&w=majority"
);

let todoSchema = new mongoose.Schema({
  item: String,
});

function saveCallback(err) {
  if (err) {
    console.log("itemOne hasn't been saved!");
    throw err;
  }
  console.log("item saved");
}

let Todo = mongoose.model("Todo", todoSchema);
// let itemOne = Todo({ item: "buy flowers" }).save(function (err) {
//   if (err) {
//     console.log("itemOne hasn't been saved!");
//     throw err;
//   }
//   console.log("item saved");
// });

let dataPromise = getAllItems();

function getAllItems() {
  return Todo.find({});
}

let urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {
  app.get("/todo", function (req, res) {
    console.log("request: ");
    console.log(req.url);
    const queryParams = url.parse(req.url, true).query;

    console.log("before destructurization");
    const { page, size } = queryParams;

    console.log("after destructurization");

    dataPromise = Todo.find()
      .limit(size)
      .skip((page - 1) * size);
    dataPromise.then((value) => {
      console.log("items");
      console.log(value);
      res.render("todo", { todos: value });
    });
  });

  app.post("/todo", urlencodedParser, function (req, res) {
    console.log("req.body");
    console.log(req.body);
    Todo(req.body).save(function (err) {
      if (err) {
        console.log("itemOne hasn't been saved!");
        throw err;
      }
      console.log("item saved");
    });
    getAllItems().then((value) => {
      res.json(value);
    });
  });

  app.delete("/todo/:id", function (req, res) {
    console.log("invoked /todo/:id");
    console.log(req.params);
    console.log(`we are going to delete item with id: ${req.params.id}`);
    Todo.deleteOne({ _id: req.params.id }).exec();
    console.log("after deleteOne");
    getAllItems().then((items) => {
      res.json(items);
    });
  });

  app.delete("/delete/todo", function (req, res) {
    console.log("invoked /todo/by endpoint");
    console.log(req.params);
    const queryParams = url.parse(req.url, true).query;
    const { item } = queryParams;
    console.log(`we are going to delete item : "${item}"`);

    Todo.deleteMany({ item: item }).exec();
    console.log("after deleteOne");
    getAllItems().then((items) => {
      res.json(items);
    });
  });
};
