import { useState } from 'react';

const genres = [
  'Rock', 'Jazz', 'Hip Hop', 'Classical', 'Electronic',
  'Pop', 'R&B', 'Country', 'Metal', 'Folk',
  'Blues', 'Latin', 'Reggae', 'Punk', 'Soul'
];

export default function GenreSelector({ selectedGenres, onGenreChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Favorite Genres (select up to 3)</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreChange(genre)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedGenres.includes(genre)
                ? 'bg-spotifyGreen text-white'
                : 'bg-butterfy-light text-darkText hover:bg-spotifyGreen'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}