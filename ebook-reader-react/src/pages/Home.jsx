import { Link } from "react-router-dom"
import { ArrowRight, BookOpen } from "lucide-react"
import Navbar from "../components/common/Navbar"

const Home = () => {
  return (
    <div className="min-h-full bg-background">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <BookOpen className="h-7 w-7" strokeWidth={2.2} />
        </span>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your next great read, one click away
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
          Discover, collect, and enjoy thousands of ebooks in a beautifully
          minimal reading experience.
        </p>
        <Link
          to="/login"
          className="mt-8 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.99]"
        >
          Sign In to your library
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}

export default Home;