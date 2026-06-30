import Navbar from "./Navbar"

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle abstract geometric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, oklch(0.49 0.18 270 / 0.06), transparent 35%), radial-gradient(circle at 80% 30%, oklch(0.49 0.18 270 / 0.05), transparent 40%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.9 0.006 260 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.9 0.006 260 / 0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />

      <div className="relative z-10">
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
          {children}
        </main>
      </div>
    </div>
  )
}
