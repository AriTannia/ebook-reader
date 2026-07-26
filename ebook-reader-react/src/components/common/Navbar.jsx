import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, User, LogOut, Search, ShoppingCart, LayoutDashboard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/auth";

export default function Navbar() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    navigate("/");
  };

  const handleLibraryClick = () => {
    if (isLoggedIn) {
      navigate("/library");
    } else {
      navigate("/login");
    }
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  // Derive initials for the avatar placeholder
  const initials = currentUser?.fullName
    ? currentUser.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  useEffect(() => {
    console.log(
      "Trạng thái đăng nhập thay đổi! isLoggedIn =",
      isLoggedIn,
      "User =",
      currentUser,
    );
  }, [isLoggedIn, currentUser]);

  const hasUser =
    isLoggedIn && currentUser && Object.keys(currentUser).length > 0;

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2">
        {/* Branding — far left */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
            aria-label="Ebook-store home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BookOpen className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Ebook<span className="text-primary">-store</span>
            </span>
          </Link>
          </div>
        {/* Spacer */}
        <div className="flex-1" />

        {/* Right section: Cart + Library + Avatar */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="p-2 text-foreground rounded-lg transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            aria-label="Shopping cart"
            title="Shopping cart"
            onClick={handleCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          {currentUser ? (
            <Link
              to="/library"
              className="px-3 py-2 text-sm font-medium text-foreground rounded-lg transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              Library
            </Link>
          ) : (
            <button
              onClick={handleLibraryClick}
              className="px-3 py-2 text-sm font-medium text-foreground rounded-lg transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              Library
            </button>
          )}
        </div>

        {/* Far right */}
        <div className="flex items-center shrink-0 ml-2">
          {hasUser ? (
            /* ── Authenticated: avatar + hover dropdown ── */
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Circular avatar */}
              <button
                aria-label="Open profile menu"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md ring-2 ring-primary/20 transition-all hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    onError={() => setImgError(true)}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>

              {/* Dropdown card */}
              {dropdownOpen && (
                <div
                  role="menu"
                  className="animate-dropdown-fade absolute right-0 top-full mt-2.5 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                >
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    View Profile
                  </Link>

                  <button
                    role="menuitem"
                    onClick={handleDashboardClick}
                    hidden={!currentUser.roles.includes("ROLE_ADMIN")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-muted-foreground" />
                    Dashboard
                  </button>

                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest: prominent Sign In button ── */
            <Link
              to="/login"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:opacity-95 active:scale-[0.97] cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
