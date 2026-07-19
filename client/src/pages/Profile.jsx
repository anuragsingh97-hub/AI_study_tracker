import { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfileAnalytics from "../components/profile/ProfileAnalytics";
import ProfileSettings from "../components/profile/ProfileSettings";

const avatarFor = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&bold=true&size=256`;

export default function Profile() {
  const { user } = useAuth();
  const initialProfile = useMemo(() => {
    const name = user?.name || "Alex Johnson";
    return {
      name,
      email: user?.email || "alex@example.com",
      college: user?.college || "Tech University",
      branch: user?.branch || "Computer Science",
      bio:
        user?.bio ||
        "Building consistent study habits, one focused session at a time.",
      image: user?.profileImage || avatarFor(name),
      memberSince: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "January 2025",
    };
  }, [user]);

  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  return (
    <DashboardLayout tittle="Profile">
      <div className="space-y-6 pb-8">
        <ProfileHeader
          profile={profile}
          setProfile={setProfile}
          editing={editing}
          setEditing={setEditing}
        />
        <ProfileOverview />
        <ProfileAnalytics />
        <ProfileSettings />
      </div>
    </DashboardLayout>
  );
}
