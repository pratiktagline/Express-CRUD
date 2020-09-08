const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

const movies = require('./movies');

app.get('/movies', (req, res) => {
   res.json(movies);
});

app.get('/movies/:id([0-9]{3,})', (req, res) => {
   const currMovie = movies.filter( (movie) => {
      if (movie.id == req.params.id) {
         return true;
      }
   });

   if (currMovie.length == 1) {
      res.json(currMovie[0])
   } else {
      res.status(404);
      res.json({ message: "Not Found" });
   }
});

app.post('/', (req, res) => {

   if (!req.body.name ||
      !req.body.year.toString().match(/^[0-9]{4}$/g) ||
      !req.body.rating.toString().match(/^[0-9]\.[0-9]$/g)) {
      res.status(400);
      res.json({ message: "Bad Request" });
   } else {
      const newId = movies[movies.length - 1].id + 1;
      movies.push({
         id: newId,
         name: req.body.name,
         year: req.body.year,
         rating: req.body.rating
      });
      res.json({ message: "New movie created.", location: "/movies/" + newId });
   }
});

app.put('/:id', (req, res) => {
   //Check if all fields are provided and are valid:
   if (!req.body.name ||
      !req.body.year.toString().match(/^[0-9]{4}$/g) ||
      !req.body.rating.toString().match(/^[0-9]\.[0-9]$/g) ||
      !req.params.id.toString().match(/^[0-9]{3,}$/g)) {

      res.status(400);
      res.json({ message: "Bad Request" });
   } else {
      //Gets us the index of movie with given id.
      var updateIndex = movies.map((movie) => {
         return movie.id;
      }).indexOf(parseInt(req.params.id));

      if (updateIndex === -1) {
         //Movie not found, create new
         movies.push({
            id: req.params.id,
            name: req.body.name,
            year: req.body.year,
            rating: req.body.rating
         });
         res.json({ message: "New movie created.", location: "/movies/" + req.params.id });
      } else {
         //Update existing movie
         movies[updateIndex] = {
            id: req.params.id,
            name: req.body.name,
            year: req.body.year,
            rating: req.body.rating
         };
         res.json({
            message: "Movie id " + req.params.id + " updated.",
            location: "/movies/" + req.params.id
         });
      }
   }
});

app.delete('/:id', function(req, res){
   var removeIndex = movies.map(function(movie){
      return movie.id;
   }).indexOf(req.params.id); //Gets us the index of movie with given id.
   
   if(removeIndex === -1){
      res.json({message: "Not found"});
   } else {
      movies.splice(removeIndex, 1);
      res.send({message: "Movie id " + req.params.id + " removed."});
   }
});

app.listen(3000);