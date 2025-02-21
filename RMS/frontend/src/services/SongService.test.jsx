import axios from "axios";
import SongService from "./SongService";

// ✅ Mock axios
jest.mock("axios");

describe("SongService", () => {
  const API_URL = "http://localhost:3000/api/songs/";

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  // ✅ Test: Add a song (Success)
  test("should successfully add a new song", async () => {
    const newSong = { title: "Test Song", artist: "12345" };
    const mockResponse = { data: { message: "Song added successfully" } };

    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await SongService.addSong(newSong);

    expect(axios.post).toHaveBeenCalledWith(API_URL, newSong, expect.any(Object));
    expect(result).toEqual(mockResponse.data);
  });

  // ✅ Test: Add song (Duplicate song)
  test("should throw an error if a song with the same name already exists", async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 409 } });

    await expect(SongService.addSong({ title: "Test Song" })).rejects.toThrow(
      "A song with the same name already exists."
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  // ✅ Test: Add song (Server error)
  test("should throw an error if the API fails with a 500 error", async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 500 } });

    await expect(SongService.addSong({ title: "Test Song" })).rejects.toThrow(
      "An error occurred while adding the song."
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  // ✅ Test: Add song (Network error)
  test("should throw an error if there is a network issue", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    await expect(SongService.addSong({ title: "Test Song" })).rejects.toThrow(
      "An error occurred while adding the song."
    );

    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  // ✅ Test: Fetch songs by artist (Success)
  test("should fetch songs by artist ID", async () => {
    const artistId = "12345";
    const mockResponse = { data: { songs: [{ id: "1", title: "Song 1" }] } };

    axios.get.mockResolvedValueOnce(mockResponse);

    const result = await SongService.fetchSongsByArtist(artistId);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}artist/${artistId}`, expect.any(Object));
    expect(result).toEqual(mockResponse.data.songs);
  });

  // ✅ Test: Fetch songs (No songs found)
  test("should return an empty array when no songs are found", async () => {
    axios.get.mockResolvedValueOnce({ data: { songs: [] } });

    const result = await SongService.fetchSongsByArtist("12345");

    expect(result).toEqual([]);
  });

  // ✅ Test: Fetch songs (Server error)
  test("should throw an error if fetching songs fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Server error"));

    await expect(SongService.fetchSongsByArtist("12345")).rejects.toThrow(
      "An error occurred while fetching songs."
    );

    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  // ✅ Test: Delete song (Success)
  test("should delete a song successfully", async () => {
    const songId = "1";
    const mockResponse = { data: { message: "Song deleted successfully" } };

    axios.delete.mockResolvedValueOnce(mockResponse);

    const result = await SongService.deleteSong(songId);

    expect(axios.delete).toHaveBeenCalledWith(`${API_URL}${songId}`, expect.any(Object));
    expect(result).toEqual(mockResponse.data);
  });

  // ✅ Test: Delete song (Not found)
  test("should throw an error if song is not found", async () => {
    axios.delete.mockRejectedValueOnce({ response: { status: 404 } });

    await expect(SongService.deleteSong("1")).rejects.toThrow(
      "An error occurred while deleting the song."
    );

    expect(axios.delete).toHaveBeenCalledTimes(1);
  });

  // ✅ Test: Delete song (Unauthorized)
  test("should throw an error if unauthorized request", async () => {
    axios.delete.mockRejectedValueOnce({ response: { status: 401 } });

    await expect(SongService.deleteSong("1")).rejects.toThrow(
      "An error occurred while deleting the song."
    );

    expect(axios.delete).toHaveBeenCalledTimes(1);
  });

  // ✅ Test: Delete song (Network error)
  test("should throw an error if network issue occurs while deleting", async () => {
    axios.delete.mockRejectedValueOnce(new Error("Network error"));

    await expect(SongService.deleteSong("1")).rejects.toThrow(
      "An error occurred while deleting the song."
    );

    expect(axios.delete).toHaveBeenCalledTimes(1);
  });
});
