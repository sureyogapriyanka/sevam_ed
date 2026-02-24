import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            disabled={true}
            title="Theme switching is currently disabled"
        >
            {theme === "light" ? (
                <Moon className="h-4 w-4 transition-all duration-300" />
            ) : (
                <Sun className="h-4 w-4 transition-all duration-300" />
            )}
        </Button>
    );
}
