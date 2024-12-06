import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./List.css";

const Playlist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, genres, similarUsers } = location.state || {}; 

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("songs"); 
  const token = localStorage.getItem("spotify_access_token");

  const [communityData, setCommunityData] = useState({
    songs: {},
    albums: {},
    artists: {},
  });

  const fetchSimilarUserPreferences = async () => {
    if (!similarUsers || similarUsers.length === 0) {
      console.log("No similar users found. Defaulting to regular recommendations.");
      return; 
    }

    try {
      // Replace with  backend API call after
      const response = await fetch(`/api/similar-users-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ similarUsers }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch community data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched community data:", data);

      setCommunityData({
        songs: data.songs || {},
        albums: data.albums || {},
        artists: data.artists || {},
      });
    } catch (error) {
      console.error("Error fetching similar user preferences:", error);
    }
  };

  const adjustRecommendations = (items, type) => {
    const scores = communityData[type] || {}; 
    return items.map((item) => ({
      ...item,
      score: scores[item.id] || 0, 
    })).sort((a, b) => b.score - a.score); 
  };

  const handleVote = async (id, type, vote) => {
    try {
      
      setCommunityData((prev) => {
        const updated = { ...prev };
        if (!updated[type]) updated[type] = {};
        updated[type][id] = (updated[type][id] || 0) + (vote === "like" ? 1 : -1);
        return updated;
      });

      await fetch(`/api/update-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type, vote, username }),
      });
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const fetchRecommendations = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recommendations/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genres }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} recommendations: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched ${type} recommendations:`, data);

      const adjustedData = adjustRecommendations(data, type);
      if (type === "songs") setSongs(adjustedData);
      if (type === "albums") setAlbums(adjustedData);
      if (type === "artists") setArtists(adjustedData);
    } catch (error) {
      console.error(`Error fetching ${type} recommendations:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("No access token found. Please log in.");
      navigate("/");
      return;
    }

    fetchSimilarUserPreferences().then(() => fetchRecommendations("songs"));
  }, [token]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    fetchRecommendations(tab); 
  };

  return (
    <div className="playlist-container">
      <div className="header">
        <h1 className="title" onClick={() => navigate("/")}>Butterfy</h1>
        <button className="save-button">Save & Share</button>
      </div>

      <div className="recommendation-tabs">
        <button className={`tab ${activeTab === "songs" ? "active-tab" : ""}`} onClick={() => switchTab("songs")}>
          Songs
        </button>
        <button className={`tab ${activeTab === "albums" ? "active-tab" : ""}`} onClick={() => switchTab("albums")}>
          Albums
        </button>
        <button className={`tab ${activeTab === "artists" ? "active-tab" : ""}`} onClick={() => switchTab("artists")}>
          Artists
        </button>
      </div>

      <select className="genre-dropdown" onChange={(e) => fetchRecommendations(activeTab, e.target.value)}>
        <option value="">Filter by Genre</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>

      {loading && <p>Loading {activeTab}...</p>}

      <div className="recommendations-list">
        {(activeTab === "songs" ? songs : activeTab === "albums" ? albums : artists).map((item) => (
          <div key={item.id} className="recommendation-item">
            <img src={item.image || item.album?.images[0]?.url} alt={item.name} className="recommendation-image" />
            <p className="recommendation-name">{item.name}</p>
            <div>
              <button onClick={() => handleVote(item.id, activeTab, "like")}>👍 Like</button>
              <button onClick={() => handleVote(item.id, activeTab, "dislike")}>👎 Dislike</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
