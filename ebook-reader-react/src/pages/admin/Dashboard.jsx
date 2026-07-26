import { useEffect, useState } from "react";
import { BookOpen, BookUser, Menu, ShoppingCart, Users, Building2, FolderTree, Tag, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { UsersView } from "./UsersView";
import { BooksView } from "./BooksView";
import { OrdersView } from "./OrdersView";
import { AuthorView } from "./AuthorView";
import { PublisherView } from "./PublisherView";
import { CategoryView } from "./CategoryView";
import { TagView } from "./TagView";
import { logout } from "../../reducers/auth";

const NAV = [
  { key: "users", label: "Users", icon: Users },
  { key: "books", label: "Books", icon: BookOpen },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "authors", label: "Authors", icon: BookUser},
  { key: "publishers", label: "Publishers", icon: Building2 },
  { key: "categories", label: "Categories", icon: FolderTree },
  { key: "tags", label: "Tags", icon: Tag}
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SidebarContent({ active, onNavigate, collapsed, onToggle }) {
  return (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center rounded-lg p-2 transition-colors hover:bg-muted"
        >
          <Menu className="size-6 shrink-0" />
          {!collapsed && (
            <span className="ml-3 text-lg font-bold"> Dashboard </span>
          )}
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-3">
        {NAV.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              title={collapsed ? label : undefined}
              className={cx(
                "flex w-full rounded-xl px-4 py-4 text-lg font-semibold transition-all duration-200",
                collapsed ? "justify-center" : "items-center gap-4",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-6 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [active, setActive] = useState("users");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Desktop sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
    };
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
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="fixed left-4 top-20 z-30 rounded-lg border border-border bg-card p-2 shadow md:hidden"
      >
        <Menu className="size-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={cx(
          "fixed left-0 top-16 hidden h-[calc(100vh-4rem)] border-r border-sidebar-border bg-sidebar transition-all duration-300 md:block",
          sidebarCollapsed ? "w-20" : "w-72",
        )}
      >
        <SidebarContent
          active={active}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/40 backdrop-blur-sm"
          />

          <aside className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 border-r border-sidebar-border bg-sidebar shadow-xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-3 rounded-md p-2 hover:bg-muted"
            >
              <X className="size-6" />
            </button>

            <SidebarContent
              active={active}
              onNavigate={handleNavigate}
              collapsed={false}
              onToggle={() => {}}
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div
        className={cx(
          "min-w-0 flex-1 transition-all duration-300",
          sidebarCollapsed ? "md:ml-20" : "md:ml-72",
        )}
      >
        <main className="min-w-0">
          {active === "users" && <UsersView />}
          {active === "books" && <BooksView />}
          {active === "orders" && <OrdersView />}
          {active === "authors" && <AuthorView />}
          {active === "publishers" && <PublisherView />}
          {active === "categories" && <CategoryView />}
          {active === "tags" && <TagView />}
        </main>
      </div>
    </div>
  );
}
