export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before the page paints: applies the visitor's saved choice,
// or the default theme from Site settings, so the page never flashes.
export function themeScript(defaultTheme: "light" | "dark") {
  return `(function(){var t=${JSON.stringify(defaultTheme)};try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||t}catch(e){}if(t==="dark")document.documentElement.dataset.theme="dark"})()`;
}
