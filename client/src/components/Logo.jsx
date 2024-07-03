import { useTheme } from "../hooks/useTheme.js";

function Logo() {
  const themeMode = useTheme();

  return (
    <div style={{ 
      userSelect: "none",
      WebkitTapHighlightColor: "transparent"
       }}>
      <img
        className="w-8 cursor-pointer hover:scale-110 transition-transform"
        src={themeMode === "dark" ? "/favicon.png" : "/favicon.png"}
        alt="logo"
      />
    </div>
  );
}

export default Logo;
