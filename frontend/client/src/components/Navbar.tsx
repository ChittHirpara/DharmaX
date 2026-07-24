import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Moon } from "lucide-react";
import DharmaLogo from "./DharmaLogo";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Learnings", path: "#learnings" },
  { name: "Pricing", path: "#pricing" },
  { name: "About", path: "#about" },
  
];

const Navbar = ({ onLoginClick, onLogoutClick, user }: { onLoginClick?: () => void, onLogoutClick?: () => void, user?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isGenZMode, toggleGenZMode } = useTheme();

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <DharmaLogo size={40} />
            <span className="font-display text-2xl font-bold text-gradient-white">
              Noera<span className="text-dharma-flame">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className="relative text-foreground/80 hover:text-primary transition-colors duration-300 font-medium group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            

            {/* LOGIN BUTTON */}
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 bg-primary rounded-md text-sm text-black hover:bg-primary/90 transition cursor-pointer font-medium"
                >
                  Enter Chat
                </button>
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 border border-primary/50 rounded-md text-sm text-primary hover:bg-primary/10 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 border border-primary rounded-md text-sm text-primary hover:bg-primary hover:text-black transition cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-2 glass-card p-4"
            >
              {navLinks.map((link, index) =>(
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavClick(link.path)}
                  className="block w-full text-left py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {link.name}
                </motion.button>
              ))}
              


              {/* LOGIN BUTTON OUTSIDE MAP */}
              {user ? (
                <div className="flex flex-col gap-3 mt-3">
                  <button
                    onClick={onLoginClick}
                    className="block w-full text-center py-3 bg-primary rounded-lg text-black hover:bg-primary/90 transition cursor-pointer font-medium"
                  >
                    Enter Chat
                  </button>
                  <button
                    onClick={onLogoutClick}
                    className="block w-full text-center py-3 border border-primary/50 rounded-lg text-primary hover:bg-primary/10 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="block w-full text-center py-3 mt-3 border border-primary rounded-lg text-primary hover:bg-primary hover:text-black transition cursor-pointer"
                >
                  Login
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
