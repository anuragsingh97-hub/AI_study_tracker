import { motion } from "framer-motion";
import { Camera, Edit3, Save } from "lucide-react";

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Please choose a valid image file."));
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

export default function ProfileHeader({ profile, setProfile, editing, setEditing, onSave, saving = false }) {
  const update = (field, value) => setProfile((current) => ({ ...current, [field]: value }));
  const upload = async (event) => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/")) { window.alert("Please select an image file."); return; } if (file.size > 10 * 1024 * 1024) { window.alert("Please choose an image smaller than 10 MB."); return; } try { update("image", await compressImage(file)); setEditing(true); } catch (error) { window.alert(error.message); } finally { event.target.value = ""; } };
  const input = (field, label) => <input value={profile[field]} onChange={(event) => update(field, event.target.value)} placeholder={label} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500" />;
  return <motion.section initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl"><div className="flex flex-col gap-6 lg:flex-row lg:items-center"><div className="relative mx-auto shrink-0 lg:mx-0"><img src={profile.image} alt="Profile" className="h-28 w-28 rounded-full border-4 border-blue-500 object-cover"/><label title="Change profile photo" className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-blue-600 text-white"><Camera size={16}/><input type="file" accept="image/*" onChange={upload} className="hidden"/></label></div><div className="min-w-0 flex-1 text-center lg:text-left">{editing ? <div className="grid gap-3 sm:grid-cols-2">{input("name", "Name")}{input("college", "College")}{input("branch", "Branch")}{input("bio", "Bio")}</div> : <><p className="text-sm font-medium text-blue-300">AI-powered learner</p><h1 className="mt-1 text-3xl font-bold text-white">{profile.name}</h1><p className="mt-1 text-slate-400">{profile.email}</p><p className="mt-3 text-sm text-slate-300">{profile.college} · {profile.branch}</p><p className="mt-2 text-sm text-slate-400">{profile.bio}</p></>}<p className="mt-4 text-xs text-slate-500">Member since {profile.memberSince}</p></div><button type="button" disabled={saving} onClick={() => editing ? onSave() : setEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{editing ? <><Save size={18}/>{saving ? "Saving..." : "Save Changes"}</> : <><Edit3 size={18}/>Edit Profile</>}</button></div></motion.section>;
}
