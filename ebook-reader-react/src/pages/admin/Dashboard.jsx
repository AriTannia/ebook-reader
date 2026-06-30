import { useEffect, useState } from "react";
import { BookOpen, LogOut, Menu, ShoppingCart, Users, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Avatar } from "../../components/admin.ui/CommonUI";
import { UsersView } from "./UsersView";
import { BooksView } from "./BooksView";
import { OrdersView } from "./OrdersView";
import { logout } from "../../reducers/auth";

const NAV = [
  { key: "users", label: "Users", icon: Users },
  { key: "books", label: "Books", icon: BookOpen },
  { key: "orders", label: "Orders", icon: ShoppingCart },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SidebarContent({ active, onNavigate, admin, onLogout }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center px-5">
        <span className="text-base font-semibold tracking-tight text-foreground">
          Ebook Reader
          <span className="ml-1 text-muted-foreground">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Primary">
        {NAV.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={isActive ? "page" : undefined}
              className={cx(
                "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
          <Avatar src={admin?.avatarUrl} name={admin?.fullName ?? "Admin"} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-foreground">
              {admin?.fullName ?? "Admin"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{admin?.email ?? ""}</p>
          </div>
          <button
            type="button"
            aria-label="Log out"
            onClick={onLogout}
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);

  const [active, setActive] = useState("users");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const handleNavigate = (key) => {
    setActive(key);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-sidebar-border bg-sidebar md:block">
        <SidebarContent
          active={active}
          onNavigate={handleNavigate}
          admin={currentUser}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default bg-foreground/30 backdrop-blur-[1px]"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar shadow-xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-2 top-3 inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <SidebarContent
              active={active}
              onNavigate={handleNavigate}
              admin={currentUser}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-60">
        {/* Mobile top bar with hamburger */}
        <div className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Ebook Reader <span className="text-muted-foreground">Admin</span>
          </span>
        </div>

        <main className="min-w-0 flex-1">
          {active === "users" && <UsersView />}
          {active === "books" && <BooksView />}
          {active === "orders" && <OrdersView />}
        </main>
      </div>
    </div>
  );
}