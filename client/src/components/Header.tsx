"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../store/slices/authSlice";
import { Button } from "./ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import ThemeToggle from "./ThemeToggle";

/**
 * Header component with navigation and user menu
 */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Blog App
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/blogs"
              className={`text-sm ${
                location.pathname === "/blogs"
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Blogs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative group">
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
              >
                <Avatar className="h-8 w-8">
                  {user?.avatar ? (
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                  ) : (
                    <AvatarFallback>
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
              <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-card rounded-md shadow-md border p-2">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <div className="h-px bg-muted my-1"></div>
                  <button
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                    onClick={() => navigate("/blogs/new")}
                  >
                    Create Blog
                  </button>
                  <button
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <div className="h-px bg-muted my-1"></div>
                  <button
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
