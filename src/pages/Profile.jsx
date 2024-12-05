import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/Profile/ProfileForm';
import GenreSelector from '../components/Profile/GenreSelector';
import Search from '../components/Profile/Search';
import Header from '../components/Profile/Layout/Header';

export default function Profile() {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);

  const handleGenreChange = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleArtistSelect = (artist) => {
    if (!selectedArtists.find(a => a.id === artist.id)) {
      setSelectedArtists(prev => [...prev, artist]);
    }
  };

  const handleSubmit = async (profileData) => {
    const completeProfile = {
      ...profileData,
      genres: selectedGenres,
      artists: selectedArtists,
    };
    // TODO: Send to backend
    console.log(completeProfile);
    navigate('/list');
  };

  return (
    <div className="min-h-screen bg-butterfy-dark">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl text-center font-bold mb-8">Welcome to Butterfy! Lets Take the Next Steps To Create Your Profile.</h1>
        
        <div className="space-y-8">
          <ProfileForm onSubmit={handleSubmit} />
          
          <GenreSelector
            selectedGenres={selectedGenres}
            onGenreChange={handleGenreChange}
          />
          
          <Search query="Artist" onSelect={handleArtistSelect} />
          
          <div className="flex flex-wrap gap-2">
            {selectedArtists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-center gap-2 bg-butterfy-light text-darkText px-3 py-2 rounded-full"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{artist.name}</span>
                <button
                  onClick={() => setSelectedArtists(prev =>
                    prev.filter(a => a.id !== artist.id)
                  )}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubmit()}
            className="w-full bg-butterfy-accent text-white py-3 px-4 rounded-full hover:bg-opacity-90"
          >
            Save Profile
          </button>
        </div>
      </main>
    </div>
  );
}