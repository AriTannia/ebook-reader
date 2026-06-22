import { React, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Library } from "lucide-react"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { user } from '../reducers/user';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { selectedUser, loading } = useSelector((state) => state.user); 

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUserProfile(currentUser.id));
    }
  }, [dispatch, currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              You are not signed in.{" "}
              <Link to="/login" className="font-medium text-primary hover:opacity-80">
                Sign In
              </Link>
            </p>
          </div>
        </main>
      </div>
    )
  }

  const initials = currentUser.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-6 py-12">
        <div className="w-full animate-fade-in-up">

          {/* ── Profile Card ── */}
          <div className="rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">

            {/* Top section — avatar + name + email */}
            <div className="flex flex-col items-center border-b border-border px-8 py-10">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-primary/15"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-md ring-4 ring-primary/15">
                  {initials}
                </div>
              )}

              <h1 className="mt-5 text-balance text-xl font-semibold tracking-tight text-foreground">
                {currentUser.fullName}&apos;s Profile
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentUser.email}
              </p>
            </div>

            {/* Metadata grid */}
            <div className="flex flex-col gap-0 divide-y divide-border px-8 py-2">

              {/* User ID */}
              <div className="flex items-center justify-between py-4">
                <span className="text-sm font-medium text-muted-foreground">
                  User ID
                </span>
                <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-medium text-foreground">
                  {currentUser.id}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Email Address
                </span>
                <span className="max-w-[220px] truncate text-sm text-foreground">
                  {currentUser.email}
                </span>
              </div>

              {/* Roles */}
              <div className="flex items-start justify-between gap-4 py-4">
                <span className="shrink-0 text-sm font-medium text-muted-foreground">
                  Authorities
                </span>
                {currentUser.roles.length > 0 ? (
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {currentUser.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    No roles assigned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Primary action ── */}
          <Link
            to="/"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.99]"
          >
            <Library className="h-4 w-4" />
            Go to Library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Profile;