const express = require("express");
const { checkParams, checkBody } = require("./validation/validator");
const { idScheme, userScheme } = require("./validation/scheme");
const fs = require("fs");
const path = require("path");
const pathToFile = path.join(__dirname, "user.json");

const app = express();

let uniqueID = 0;
const users = [];

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

/* 
Получить всех пользователей
*/
app.get("/users", (req, res) => {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const usersParsed = JSON.parse(data);
    res.send({ usersParsed });
  });
});

/* 
Получить одного пользователя
*/
app.get("/users/:id", checkParams(idScheme), (req, res) => {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const usersParsed = JSON.parse(data);
    const user = usersParsed.find(
      (user) => user.id === parseInt(req.params.id)
    );
    if (user) {
      res.send({ user });
    } else {
      res.status(404).send({
        user: null,
      });
    }
  });
});

/* 
Создать нового пользователя
*/

app.post("/users", checkBody(userScheme), (req, res) => {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const usersParsed = JSON.parse(data);
    const maxId = Math.max(...usersParsed.map((user) => user.id));
    uniqueID = maxId + 1;
    usersParsed.push({
      id: uniqueID,
      ...req.body,
    });
    res.send({ usersParsed });
    fs.writeFileSync(pathToFile, JSON.stringify(usersParsed, null, 2));
  });
});

/* 
Обновить пользователя
*/

app.put(
  "/users/:id",
  checkParams(idScheme),
  checkBody(userScheme),
  (req, res) => {
    fs.readFile(pathToFile, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      const usersParsed = JSON.parse(data);
      const user = usersParsed.find(
        (user) => user.id === parseInt(req.params.id)
      );
      if (user) {
        user.firstName = req.body.firstName;
        user.secondName = req.body.secondName;
        user.age = req.body.age;
        user.city = req.body.city;
        res.send({ user });
        fs.writeFileSync(pathToFile, JSON.stringify(usersParsed, null, 2));
      } else {
        res.status(404).send({
          user: null,
        });
      }
    });
  }
);

/* 
Удалить пользователя
 */

app.delete("/users/:id", (req, res) => {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const usersParsed = JSON.parse(data);
    const user = usersParsed.find(
      (user) => user.id === parseInt(req.params.id)
    );
    if (user) {
      usersParsed.splice(usersParsed.indexOf(user), 1);
      res.send({ user });
      fs.writeFileSync(pathToFile, JSON.stringify(usersParsed, null, 2));
    } else {
      res.status(404).send({
        user: null,
      });
    }
  });
});

/* 
Роут не найден
 */
app.use((req, res) => {
  res.status(404).send({
    message: "URL not found",
  });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
