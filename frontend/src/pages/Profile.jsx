import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile, getErrorMessage } from "../services/api.js";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Please choose an image under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile({ ...form, avatar });
      updateUser(res.data.user);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500">Manage your account details</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 animate-fade-up">
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative h-24 w-24 rounded-full bg-gradient-brand flex items-center justify-center text-3xl font-bold text-white cursor-pointer overflow-hidden shadow-md shadow-primary-500/20 hover:opacity-90 transition"
          >
            {avatar ? (
              <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-xs text-white transition">
              Change
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-primary-600 font-medium hover:text-primary-700"
          >
            Change photo
          </button>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Full name</label>
          <input
            type="text"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Email</label>
          <input type="email" className="input bg-gray-100" value={user?.email || ""} disabled />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Phone number</label>
          <input
            type="tel"
            placeholder="e.g. +91 98765 43210"
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Bio</label>
          <textarea
            placeholder="A short line about yourself..."
            maxLength={200}
            className="input min-h-[80px]"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/200</p>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;