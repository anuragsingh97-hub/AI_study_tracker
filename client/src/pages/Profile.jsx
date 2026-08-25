import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";
import API from "../api/axios";
import { getStudies } from "../api/studyApi";
import { getGoals } from "../api/goalApi";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfileAnalytics from "../components/profile/ProfileAnalytics";
import ProfileSettings from "../components/profile/ProfileSettings";
const avatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&bold=true&size=256`;
export default function Profile() {
  const { user, loadUser } = useAuth(); const [studies, setStudies] = useState([]); const [goals, setGoals] = useState([]); const [editing, setEditing] = useState(false); const [saving, setSaving] = useState(false);
  const initial = useMemo(() => { const name = user?.name || ""; return { name, email: user?.email || "", college: user?.college || "", branch: user?.branch || "", bio: user?.bio || "", image: user?.profileImage || avatar(name || "Student"), memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "" }; }, [user]);
  const [profile, setProfile] = useState(initial); useEffect(() => setProfile(initial), [initial]);
  useEffect(() => { Promise.allSettled([getStudies(), getGoals()]).then(([study, goal]) => { if (study.status === "fulfilled") setStudies(study.value.data.studies || []); if (goal.status === "fulfilled") setGoals(goal.value.data.goals || []); }); }, []);
  const save = async (extra = {}) => { setSaving(true); try { await API.put("/auth/profile", { name: profile.name, college: profile.college, branch: profile.branch, bio: profile.bio, profileImage: profile.image.startsWith("data:") ? profile.image : user?.profileImage || "", ...extra }); await loadUser(); setEditing(false); toast.success("Profile saved"); } catch (error) { toast.error(error.response?.data?.message || "Could not save profile"); } finally { setSaving(false); } };
  return <DashboardLayout tittle="Profile"><div className="space-y-6 pb-8"><ProfileHeader profile={profile} setProfile={setProfile} editing={editing} setEditing={setEditing} onSave={save} saving={saving}/><ProfileOverview studies={studies} goals={goals}/><ProfileAnalytics studies={studies}/><ProfileSettings user={user} onSave={save} saving={saving}/></div></DashboardLayout>;
}
