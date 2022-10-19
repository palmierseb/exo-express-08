require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT ;
const database = require("./database.js");
const validateUser = require("./middleware/validateUser.js");
const validateMovie = require("./middleware/validateMovie.js");
const verifyPassword = require("./auth/verifyPassword.js");
const verifyToken = require("./auth/verifyToken.js");

app.use(express.json());

const Home = (req, res) => {
  res.send("Welcome to my favourite movie list");
};



const MovieById = (req, res) => {
   const id = req.params.id;
    database.query("SELECT * FROM movies WHERE id = ?", [id])
    .then(([results])=> {
        if(results[0] != null) {
            res.json(results[0]);
        } else {
            res.status(404).send("Movie not found");
        }
    }).catch(err => {
        console.error(err);
    });
}

const getMovies = async (req, res) => {
    const movies = await database.query("SELECT * FROM movies");
    res.json(movies);
}

const postMovie = async (req, res) => {
  const {title, director,year, color, duration} = req.body;
  await database.query("INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)", [title, director, year, color, duration])
  .then(([results]) => { 
    res.location(`/movies/${results.insertId}`).status(201);
  })
  .catch(err => {
      res.status(500).send("Error saving movie");
  });

}

const getUsers = async (req, res) => {
    const users = "SELECT * FROM users";
    const where = [];

    if(req.query.language != null) {
        where.push({
            column: "language",
            operator: "=",
            value: req.query.language
        });
    }
    if(req.query.city != null) {
        where.push({
            column: "city",
            operator: "=",
            value: req.query.city
        });
    }
    await database 
    .query(
        where.reduce(
            (query,{column,operator}, index) => 
            `${query} ${index === 0 ? "WHERE" : "AND"} ${column} ${operator} ?`,users
        ),
        where.map(({value}) => value))
    .then(([results]) => {
        res.json(results);
    })
    .catch(err => {
        res.status(500).send("Error getting users");
    });
}

const postUser = async (req, res) => {
  const {firstname, lastname, email, city, language} = req.body;
  await database.query("INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)", [firstname, lastname, email, city, language])
  .then(([results]) => {
    res.location(`/users/${results.insertId}`).status(201);
  }).catch(err => {
      res.status(500).send("Error saving user");
  });
}

const getUserById = async (req, res) => {
    const id = req.params.id;
    const user = await database.query("SELECT * FROM users WHERE id = ?", [id]);
    if(user[0] != null) {
        res.json(user[0]);
    } else {
        res.status(404).send("User not found");
    }
}


const getUserByEmail = (req, res, next) => {
    const { email } = req.body;
     database
     .query("SELECT * FROM users WHERE email = ?", [email]).
     then(([results]) => {
        if(results[0] != null) {
            req.user = results[0];
            next();
        } else {
            res.status(404).send("User not found");
        }
    }
    ).catch(err => {
        res.status(500).send("Error getting user");
    });
}

const updatedUser = async (req, res) => {
    const id = req.params.id;
    const {firstname, lastname, email, city, language} = req.body;
    await database.query("UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?", [firstname, lastname, email, city, language, id])
    .then(([results]) => {
        if(results.affectedRows === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(204).send();
        }
    }).catch(err => {
        res.status(500).send("Error updating user");
    });
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    await database.query("DELETE FROM users WHERE id = ?", [id])
    .then(([results]) => {
        if(results.affectedRows === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(204).send();
        }
    }).catch(err => {
        res.status(500).send("Error deleting user");
    });
}



app.get("/", Home);
app.get("/movies/:id", MovieById);
app.get("/movies", getMovies);
app.get("/users", getUsers);
app.get("/users/:id", getUserById);


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI3LCJpYXQiOjE2NjMwNjEzNjMsImV4cCI6MTY2MzA2NDk2M30.j2QonO4B6Fssw295GRy7iD74iVZC5d4sphRb8QLXGsQ

app.post("/movies", verifyToken, validateMovie, postMovie);
app.post("/users", verifyToken,validateUser ,postUser);


app.put("/users/:id", verifyToken, validateUser, updatedUser);
app.delete("/users/:id", verifyToken, deleteUser);

app.post("/login", getUserByEmail, verifyPassword);
app.post("/register", validateUser, postUser);


console.log(process.env.NAME, process.env.CITY, process.env.LANGUAGE);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
