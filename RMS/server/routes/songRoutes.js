const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.post('/', songController.uploadSong);
router.get('/:songId', songController.getSongById);
router.get('/artist/:artistId', songController.getSongsByArtistId);
router.get('/song/:songId', songController.getSongsBySongId);
router.put('/:songId', songController.updateSong);
router.delete('/:songId', songController.deleteSong);

module.exports = router;
