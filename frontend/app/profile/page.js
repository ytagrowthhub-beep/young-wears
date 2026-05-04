"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, loading, updateProfile, deleteProfile, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: null,
    email: null,
    phone: null,
    address: null,
    profilePicture: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await updateProfile({
        name: form.name ?? user.name ?? "",
        email: form.email ?? user.email ?? "",
        phone: form.phone ?? user.phone ?? "",
        address: form.address ?? user.address ?? "",
        profilePicture: form.profilePicture ?? user.profilePicture ?? "",
      });
      setMessage("Profile updated.");
    } catch (err) {
      setError(err?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to permanently delete your account?");
    if (!ok) return;
    setDeleting(true);
    setError("");
    try {
      await deleteProfile();
      router.push("/");
    } catch (err) {
      setError(err?.message || "Could not delete account.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !user) return <div className="mx-auto max-w-5xl px-6 py-12">Loading profile...</div>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-[#0A1F44]">Your Profile</h1>
      <form onSubmit={handleUpdate} className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2">
        <input className="rounded-lg border border-slate-200 px-3 py-3" placeholder="Name" value={form.name ?? user.name ?? ""} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        <input className="rounded-lg border border-slate-200 px-3 py-3" placeholder="Email" type="email" value={form.email ?? user.email ?? ""} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        <input className="rounded-lg border border-slate-200 px-3 py-3" placeholder="Phone" value={form.phone ?? user.phone ?? ""} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
        <input className="rounded-lg border border-slate-200 px-3 py-3" placeholder="Profile Picture URL" value={form.profilePicture ?? user.profilePicture ?? ""} onChange={(e) => setForm((s) => ({ ...s, profilePicture: e.target.value }))} />
        <textarea className="rounded-lg border border-slate-200 px-3 py-3 md:col-span-2" rows={3} placeholder="Address" value={form.address ?? user.address ?? ""} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} />
        {message && <p className="text-sm text-green-600 md:col-span-2">{message}</p>}
        {error && <p className="text-sm text-red-500 md:col-span-2">{error}</p>}
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button disabled={saving} className="rounded-lg bg-[#0A1F44] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              void logout().then(() => router.push("/"));
            }}
            className="rounded-lg border border-slate-300 px-5 py-3"
          >
            Sign out of Young Wears
          </button>
          <button type="button" disabled={deleting} onClick={handleDelete} className="rounded-lg bg-red-500 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-70">
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
