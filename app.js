const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const db = new sqlite3.Database("C:/Users/Garrett McNaught/Desktop/js-backend2/Chinook_Sqlite_AutoIncrementPKs.sqlite");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const stmt = db.prepare(`INSERT INTO Artists (ArtistId, Name) VALUES (?, ?)`);

// stmt.run(278, "Kenny Loggins");

app.get("/", (request, response) => {
  response.render("form");
});

app.get("/success", (request, response) => {
  response.render("success");
});

app.get("/album", (request, response) => {
  const query = `SELECT artist.Name as Artist, album.Title as Album from artist JOIN album USING (artistId)`;
  let resultsArray = [];
  db.each(query, (err, row) => {
    if (err) throw err;
    // console.log(row);
    resultsArray.push(row);
  });
  response.render("album", { results: resultsArray });
});

app.post("/form", (request, response) => {
  db.run(
    `INSERT into Artist(Name) VALUES( '${
      request.body.name
    }')`,
    (err, row) => {
      if (err) throw err;
      db.close();
      response.redirect(303, "/success");
    }
  );
});

app.get('/form', (request, response) =>{
  response.render("form");
});

app.listen(app.get("port"), () => {
  console.log(
    "Listening on http://localhost:" +
      app.get("port") +
      "; press Ctrl-c to terminate."
  );
});
