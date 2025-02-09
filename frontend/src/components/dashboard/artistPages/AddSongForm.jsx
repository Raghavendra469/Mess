import React from "react";

const AddSongForm = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add New Song</h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Song Title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="releaseDate">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="streams">
              Total Streams
            </label>
            <input
              type="number"
              id="streams"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter total streams of the song"
            />
          </div>
          <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="collaborators">
            Collaborators
          </label>
          <input
            type="text"
            id="collaborators"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter collaborators for this song (if any)"
          />
        </div>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Song
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSongForm;