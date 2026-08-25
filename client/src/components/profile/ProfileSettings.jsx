import { useEffect, useState } from "react";
import { ExternalLink, Save, Settings2 } from "lucide-react";

const preferenceFields = [["dailyReminder", "Daily reminder"], ["goalReminder", "Goal reminder"], ["emailNotification", "Email notifications"], ["aiSuggestions", "AI suggestions"], ["weeklyReport", "Weekly report"], ["faceDetection", "Face detection"], ["phoneDetection", "Phone detection"], ["talkingDetection", "Talking detection"], ["productivityAnalysis", "Productivity analysis"]];
const socialFields = [["github", "GitHub"], ["linkedin", "LinkedIn"], ["portfolio", "Portfolio"], ["leetcode", "LeetCode"], ["codeforces", "Codeforces"]];

const safeLink = (value) => {
  const link = String(value ?? "").trim();
  if (!link) return "";
  const url = link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;
  try {
    return new URL(url).protocol === "https:" || new URL(url).protocol === "http:" ? url : "";
  } catch {
    return "";
  }
};

export default function ProfileSettings({ user, onSave, saving }) {
  const [socialLinks, setSocialLinks] = useState(user?.socialLinks ?? {});
  const [preferences, setPreferences] = useState(user?.preferences ?? {});
  useEffect(() => { setSocialLinks(user?.socialLinks ?? {}); setPreferences(user?.preferences ?? {}); }, [user]);
  return <div className="grid gap-5 xl:grid-cols-3"><section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 xl:col-span-2"><div className="flex items-center gap-3"><Settings2 className="text-blue-300" /><div><h2 className="font-bold text-white">Preferences</h2><p className="text-sm text-slate-400">Choose how your study assistant supports you.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{preferenceFields.map(([key, label]) => <label key={key} className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-300"><span>{label}</span><input type="checkbox" checked={Boolean(preferences[key])} onChange={() => setPreferences((current) => ({ ...current, [key]: !current[key] }))} className="h-5 w-5 accent-blue-500" /></label>)}</div></section><section className="rounded-3xl border border-slate-700 bg-slate-900 p-6"><h2 className="font-bold text-white">Social links</h2><p className="mt-1 text-sm text-slate-400">Add links to your learning profiles.</p><div className="mt-5 space-y-3">{socialFields.map(([key, label]) => { const href = safeLink(socialLinks[key]); return <label key={key} className="block text-xs text-slate-400"><span className="flex items-center justify-between">{label}{href && <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200">Open <ExternalLink size={13}/></a>}</span><input value={socialLinks[key] ?? ""} onChange={(event) => setSocialLinks((current) => ({ ...current, [key]: event.target.value }))} placeholder="https://..." className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" /></label>; })}</div><button type="button" onClick={() => onSave({ socialLinks, preferences })} disabled={saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"><Save size={17} />{saving ? "Saving..." : "Save settings"}</button></section></div>;
}
