import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Library, Pencil, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../reducers/user";
import AvatarUploadModal from "../components/AvatarUploadModal";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const { user: currentUser, loading: authLoading } = useSelector(
    (state) => state.auth,
  );
  const [imgError, setImgError] = useState(false);

  const loading = useSelector((state) => state.user.loading);
  const [originalForm, setOriginalForm] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
  });
  const [editForm, setEditForm] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setOriginalForm({
        fullName: currentUser.fullName,
        email: currentUser.email,
      });
      setEditForm({
        fullName: currentUser.fullName,
        email: currentUser.email,
      });
    }
  }, [currentUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              You are not signed in.{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:opacity-80"
              >
                Sign In
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  const initials = currentUser?.fullName
    ? currentUser.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const avatarUrl = currentUser.avatarUrl;

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleEditChange = (e, field) => {
    setEditForm({
      ...editForm,
      [field]: e.target.value,
    });
  };

  const hasChanges =
    editForm.fullName !== originalForm.fullName ||
    editForm.email !== originalForm.email;

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (!editForm.fullName.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }

    if (!editForm.email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }

    try {
      await dispatch(
        updateUserProfile({
          userId: currentUser.userId,
          ...editForm,
        }),
      ).unwrap();

      setOriginalForm(editForm);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to update profile.");
    }
  };

  const handleReset = () => {
    setEditForm(originalForm);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg animate-fade-in-up">
          {/* ── Profile Card ── */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            {/* Top section — avatar */}
            <div className="flex flex-col items-center bg-linear-to-b from-accent/40 to-transparent px-8 pb-8 pt-10">
              <div className="group relative">
                {/* Avatar — clickable in edit mode */}
                <div className="rounded-full ring-4 ring-card">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={currentUser.fullName}
                      onError={() => setImgError(true)}
                      className="h-28 w-28 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-md">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Pencil button */}
                <button
                  onClick={handleAvatarClick}
                  className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md ring-4 ring-card transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: "#F59E0B" }}
                  title="Change photo"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <>
                <h1 className="mt-4 text-balance text-xl font-semibold tracking-tight text-foreground">
                  {currentUser.fullName}&apos;s Profile
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              </>
            </div>

            <form
              onSubmit={handleSaveChanges}
              className="border-t border-border"
            >
              <div className="px-8 py-8 border-b border-border">
                <h2 className="mb-1 text-base font-semibold text-foreground">
                  Personal Information
                </h2>
                <p className="mb-5 text-sm text-muted-foreground">
                  Update your name and email address.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => handleEditChange(e, "fullName")}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleEditChange(e, "email")}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>

                {/* Action Buttons — chỉ hiện khi có thay đổi */}
                {hasChanges && (
                  <div className="mt-5 flex gap-3 animate-fade-in-up">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5
                     text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200
                     hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed
                     disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={loading}
                      className="flex flex-1 items-center justify-center
                     rounded-lg border border-border
                     bg-card px-4 py-2.5
                     text-sm font-medium text-foreground
                     transition-all duration-200
                     hover:bg-muted
                     hover:shadow-sm
                     active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Security Section */}
            <div className="border-t border-border px-8 py-8">
              <h2 className="mb-5 text-base font-semibold text-foreground">
                Security
              </h2>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Password
                  </p>

                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>

                <button className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted cursor-pointer">
                  Change Password
                </button>
              </div>
            </div>

            {/* Roles Section */}
            <div className="border-t border-border px-8 py-8">
              <div className="mb-3 text-base font-semibold text-foreground">
                Roles &amp; Permissions
              </div>

              <div className="flex flex-wrap gap-2">
                {currentUser.roles?.length > 0 ? (
                  currentUser.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-muted-foreground">
                    No roles assigned
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            to="/"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-card px-6 py-3 text-sm font-medium text-primary shadow-sm transition-all hover:bg-primary/5 hover:border-primary/50"
          >
            <Library className="h-4 w-4" />
            Go to Library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <AvatarUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
