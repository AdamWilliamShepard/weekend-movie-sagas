const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

//Router to get all movies from database.
router.get('/', (req, res) => {
  const query = `SELECT * FROM movies ORDER BY "title" ASC`;
  pool.query(query)
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get all movies', err);
      res.sendStatus(500)
    })

});

router.get('/:id', (req, res) => {
  console.log('This is req.params:', req.params)
  const selectedId = req.params.id
  const queryText =
    `SELECT "movies".id, "movies".title, "movies".poster, "movies".description, 
      array_to_string(array_agg("genres".name), ', ') AS genres
      FROM "movies"
      LEFT JOIN "movies_genres" ON "movies".id = "movies_genres".movie_id
      LEFT JOIN "genres" ON "movies_genres".genre_id = "genres".id
      WHERE "movies".id = $1
      GROUP BY "movies".id, "movies".title, "movies".poster, "movies".description`;
  pool.query(queryText, [selectedId])
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get single movie', err);
      res.sendStatus(500)
    })
});

//Router to post a new movie to the database.
router.post('/', (req, res) => {
  console.log(req.body);
  // RETURNING "id" will give us back the id of the created movie
  const insertMovieQuery = `
    INSERT INTO "movies" ("title", "poster", "description")
    VALUES ($1, $2, $3)
    RETURNING "id";`

  // FIRST QUERY MAKES MOVIE
  pool.query(insertMovieQuery, [req.body.title, req.body.poster, req.body.description])
    .then(result => {
      console.log('New Movie Id:', result.rows[0].id); //ID IS HERE!

      const createdMovieId = result.rows[0].id

      // Now handle the genre reference
      const insertMovieGenreQuery = `
        INSERT INTO "movies_genres" ("movie_id", "genre_id")
        VALUES  ($1, $2);`
      // SECOND QUERY ADDS GENRE FOR THAT NEW MOVIE
      pool.query(insertMovieGenreQuery, [createdMovieId, req.body.genre_id]).then(result => {
        //Now that both are done, send back success!
        res.sendStatus(201);
      }).catch(err => {
        // catch for second query
        console.log(err);
        res.sendStatus(500)
      })

      // Catch for first query
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })


})

router.put('/:id', (req, res) => {
  console.log('this is req.params', req.params)
  selectedId = req.params.id;
  selectedEdit = req.body;
  const queryText = `UPDATE "movies" 
  SET "title" = $1, "description" = $2
  WHERE "id" = $3;`
  pool.query(queryText, [selectedEdit.title, selectedEdit.description, selectedId])
  .then( (result) => {
    console.log('Successful PUT request for editing movie')
    res.sendStatus(200)
  })
  .catch((error) => {
    console.log('Error making database query- Edit Movie', error)
    res.sendStatus(500)
  })
})

module.exports = router;