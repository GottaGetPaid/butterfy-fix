import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function Search({ query, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // TODO: Implement Spotify API search
    setSearchResults([
      { id: 1, name: `${query} 1`, image: 'https://via.placeholder.com/40' },
      { id: 2, name: `${query} 2`, image: 'https://via.placeholder.com/40' },
    ]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Favorite {query}s</h3>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 bg-butterfy-light text-darkText rounded-md"
        />
      </div>
      {searchTerm && (
        <div className="bg-butterfy-light rounded-md mt-2">
          {searchResults.map((artist) => (
            <button
              key={artist.id}
              onClick={() => onSelect(artist)}
              className="w-full flex items-center gap-3 p-2 text-darkText hover:bg-spotifyGreen"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{artist.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}