const express = require('express');
const router = express.Router();

// In-memory database of profiles (to be replaced with a real database)
const profiles = [
  { id: 1, username: 'UserA', topArtists: ['Artist1', 'Artist2'], topGenres: ['Genre1'], topSongs: ['Song1'] },
  { id: 2, username: 'UserB', topArtists: ['Artist2', 'Artist3'], topGenres: ['Genre2'], topSongs: ['Song2'] },
  { id: 3, username: 'UserC', topArtists: ['Artist1', 'Artist3'], topGenres: ['Genre1', 'Genre3'], topSongs: ['Song1', 'Song3'] },
];

// Helper function: Calculates similarity between two profiles
function calculateSimilarity(profile1, profile2) {
  const intersection = (arr1, arr2) => arr1.filter(item => arr2.includes(item));
  const union = (arr1, arr2) => [...new Set([...arr1, ...arr2])];

  const artistSim = intersection(profile1.topArtists, profile2.topArtists).length / union(profile1.topArtists, profile2.topArtists).length;
  const genreSim = intersection(profile1.topGenres, profile2.topGenres).length / union(profile1.topGenres, profile2.topGenres).length;
  const songSim = intersection(profile1.topSongs, profile2.topSongs).length / union(profile1.topSongs, profile2.topSongs).length;

  return Math.round(((artistSim + genreSim + songSim) / 3) * 100);
}

// Route to handle profile creation
router.post('/create', (req, res) => {
  const { username, topArtists, topGenres, topSongs } = req.body;

  if (!username || !Array.isArray(topArtists) || !Array.isArray(topGenres) || !Array.isArray(topSongs)) {
    return res.status(400).json({ message: 'Invalid input. All fields are required and must be valid arrays.' });
  }

  const usernameExists = profiles.some(profile => profile.username === username);
  if (usernameExists) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  const newProfile = {
    id: profiles.length + 1,
    username,
    topArtists,
    topGenres,
    topSongs,
  };

  profiles.push(newProfile);

  res.status(201).json({ message: 'Profile created successfully!', profile: newProfile });
});

// Route to handle profile editing
router.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { username, topArtists, topGenres, topSongs } = req.body;

  const profileIndex = profiles.findIndex(profile => profile.id === parseInt(id, 10));
  if (profileIndex === -1) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  const updatedProfile = {
    id: profiles[profileIndex].id,
    username: username || profiles[profileIndex].username,
    topArtists: Array.isArray(topArtists) ? topArtists : profiles[profileIndex].topArtists,
    topGenres: Array.isArray(topGenres) ? topGenres : profiles[profileIndex].topGenres,
    topSongs: Array.isArray(topSongs) ? topSongs : profiles[profileIndex].topSongs,
  };

  profiles[profileIndex] = updatedProfile;

  res.json({ message: 'Profile updated successfully', profile: updatedProfile });
});

// Route to fetch top similar profiles
router.post('/matches', (req, res) => {
  try {
    const { currentUser } = req.body;

    if (!currentUser || !currentUser.id) {
      return res.status(400).json({ message: 'Invalid input. currentUser is required.' });
    }

    // Filter profiles excluding the current user
    const otherProfiles = profiles.filter(profile => profile.id !== currentUser.id);

    // Calculate similarities
    const similarities = otherProfiles.map(profile => ({
      username: profile.username,
      similarity: calculateSimilarity(currentUser, profile),
    }));

    // Filter non-zero similarity matches
    const nonZeroSimilarities = similarities.filter(match => match.similarity > 0);

    // Sort matches by similarity in descending order
    const sortedMatches = nonZeroSimilarities.sort((a, b) => b.similarity - a.similarity);

    // Limit to top 5 matches
    const topMatches = sortedMatches.slice(0, 5);

    if (topMatches.length === 0) {
      return res.status(200).json({ message: 'No matches found.', matches: [] });
    }

    res.json({ matches: topMatches });
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

// Export the router
module.exports = router;
