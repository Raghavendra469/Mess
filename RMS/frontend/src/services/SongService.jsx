import axios from "axios";

const API_URL = "http://localhost:3000/api/songs/";

const SongService = {

  addSong: async (newSong) => {
    try {
      const response = await axios.post(API_URL, newSong);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error("A song with the same name already exists.");
      } else {
        console.error("Failed to add song:", error);
        throw new Error("An error occurred while adding the song.");
      }
    }
  },

  fetchSongsByArtist: async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}artist/${artistId}`);
      return response.data.songs;
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      throw new Error("An error occurred while fetching songs.");
    }
  },

  deleteSong: async (songId) => {
    try {
      const response = await axios.delete(`${API_URL}${songId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete song:", error);
      throw new Error("An error occurred while deleting the song.");
    }
  },
};

export default SongService;
