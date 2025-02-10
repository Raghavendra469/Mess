import React from "react";
import artistImage from "./assets/artist.jpg";

const AboutArtist = () => {
  return (
    <div className="border-2 border-gray-300 rounded-lg bg-white text-teal-600 p-6 mb-6 shadow-md">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-6 max-w-3xl justify-between">
        <img src={artistImage} alt="Artist" className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover self-center md:self-end" />
        <div className="text-teal text-lg md:text-xl">
          <h2 className="text-2xl font-bold">About Artists</h2>
          <p>
            A music artist is a creative individual who composes, performs, or produces music across various genres.
            They express emotions, stories, and experiences through melodies, lyrics, and rhythms, connecting deeply with audiences.
            Music artists can be singers, instrumentalists, songwriters, or producers, working independently or with labels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutArtist;
