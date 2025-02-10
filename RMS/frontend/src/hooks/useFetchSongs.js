import { useEffect, useState } from "react";
import axios from "axios";

const useFetchSongs = (artistId) => {
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongData = async () => {
      if (!artistId) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/songs/artist/${artistId}`);
        if (response.data.success) {
          setSongData(response.data.songs);
        }
      } catch (error) {
        setError(error);
        console.error("Failed to fetch song data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongData();
  }, [artistId]);

  return { songData, loading, error };
};

export default useFetchSongs;
