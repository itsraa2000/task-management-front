import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Menu, X, User, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import { useTheme } from "next-themes";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { setTheme } = useTheme();

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    if (showThemeDropdown) setShowThemeDropdown(false);
    if (showProfileDropdown) setShowProfileDropdown(false);
  };

  // Custom ModeToggle
  const CustomModeToggle = () => {
    return (
      <div className="relative">
        <Button 
          variant="outline" 
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setShowThemeDropdown(!showThemeDropdown);
            setShowProfileDropdown(false);
          }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        {showThemeDropdown && (
          <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-background border z-[9999]">
            <div className="py-1">
              <button
                onClick={() => {
                  setTheme("light");
                  setShowThemeDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
              >
                Light
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  setShowThemeDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
              >
                Dark
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Custom Profile Menu
  const CustomProfileMenu = () => {
    return (
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setShowProfileDropdown(!showProfileDropdown);
            setShowThemeDropdown(false);
          }}
        >
          <User className="h-5 w-5" />
        </Button>
        
        {showProfileDropdown && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border z-[9999]">
            <div className="py-1">
              <div className="px-4 py-2 text-sm font-medium border-b">My Account</div>
              <button
                onClick={() => {
                  logout();
                  setShowProfileDropdown(false);
                }}
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-muted"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div onClick={handleClickOutside}>
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            TaskMaster
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/calendar" className="hover:text-primary transition-colors">
              Calendar
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <CustomModeToggle />
            
            {isAuthenticated ? (
              <CustomProfileMenu />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <Link
                to="/"
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/calendar"
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Calendar
              </Link>
              <div className="pt-3 border-t flex items-center justify-between">
                <CustomModeToggle />
                {isAuthenticated ? (
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}