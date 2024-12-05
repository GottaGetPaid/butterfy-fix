import { useState } from 'react';

export default function ProfileForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    displayName: '',
    bio: '',
    location: '',
    birthdate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Username</label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          className="w-full px-3 py-2 bg-butterfy-light text-darkText rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-3 py-2 bg-butterfy-light rounded-md h-24"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Birthday</label>
        <input
          type="date"
          value={formData.birthdate}
          onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
          className="w-full px-3 py-2 bg-butterfy-light text-darkText rounded-md"
        />
      </div>
    </form>
  );
}