import { useSelector } from "react-redux";
import Home from "./Home";
import Store from "./Store";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const { isLoggedIn, loading } = useSelector((state) => state.auth);
  
  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return isLoggedIn ? <Store /> : <Home />;
}