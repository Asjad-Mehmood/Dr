export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before the page paints, so a saved dark choice never flashes
// cream first.
export const themeScript = `try{if(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
