// Runs in <head> before paint. When motion is allowed, hide the page content
// until GSAP has set its starting positions, so nothing flashes. If the
// animation code never starts, show the content anyway after 3 seconds.
export const motionScript = `(function(){var d=document.documentElement;try{if(!matchMedia("(prefers-reduced-motion: no-preference)").matches)return}catch(e){return}d.classList.add("motion-pending");setTimeout(function(){d.classList.remove("motion-pending")},3000)})()`;
