const router = require('express').Router();
const { celebrate } = require('celebrate');
const { movieSchemaValidation, paramsIDValidation } = require('../middlewares/req-validation');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies/', getMovies);

router.post('/movies/', celebrate(movieSchemaValidation), addMovie);

router.delete('/movies/:id', celebrate(paramsIDValidation), deleteMovie);

module.exports = router;
