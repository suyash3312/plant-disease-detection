// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Leaf, LogOut } from "lucide-react";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl bg-botanical-bg/70 border-b border-botanical-forest/10"
      data-testid="app-header"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="brand-link">
          <span className="w-8 h-8 rounded-full bg-botanical-forest flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Leaf className="w-4 h-4 text-white" />
          </span>
          <span className="font-serif text-xl text-botanical-ink tracking-tight">Verdaleaf</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-botanical-muted">
          <Link to="/dashboard" className="hover:text-botanical-forest transition-colors" data-testid="nav-diagnose">Diagnose</Link>
          <a href="/dashboard#library" className="hover:text-botanical-forest transition-colors" data-testid="nav-library">Library</a>
          <a href="/dashboard#tips" className="hover:text-botanical-forest transition-colors" data-testid="nav-tips">Care Tips</a>
          {user && (
            <a href="/dashboard#history" className="hover:text-botanical-forest transition-colors" data-testid="nav-history">History</a>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2" data-testid="user-badge">
                {user.picture && (
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-botanical-forest/20" />
                )}
                <span className="text-sm text-botanical-ink">{user.name}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="rounded-full text-botanical-muted hover:text-botanical-forest hover:bg-botanical-sage/30"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4 mr-1" /> Sign out
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              className="rounded-full bg-botanical-forest text-white hover:bg-botanical-hover active:scale-95 transition-all"
              data-testid={location.pathname === "/" ? "header-login-button" : "header-login-button-dash"}
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
