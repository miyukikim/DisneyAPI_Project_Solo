# ✨ Magical Disney Characters ✨

A beautiful, immersive web app to explore thousands of Disney characters using the public [Disney API](https://disneyapi.dev/).

Experience the magic with a dreamy animated background, twinkling stars, optional Disney soundtrack, and a fully responsive character browser.

## 🌟 Features

- **Magical Visuals**  
  - Full-screen looping Disney-themed background video (`background.mp4`)
  - Twinkling animated stars across the sky
  - Floating magical glow effects
  - Glassmorphism UI with blur and transparency

- **Interactive Character Browser**  
  - Browse thousands of Disney characters with images
  - Search by name (e.g., "Mickey", "Elsa", "Simba")
  - Filter by number of films (All / 0–2 / 3+)
  - Filter by number of TV shows (All / 0–2 / 3+)
  - "Load More" pagination with smooth scrolling
  - Detailed character modal with films, TV shows, games, park attractions, allies, enemies, and more

- **User Experience**  
  - Sound toggle (🔇/🔊) for background Disney music (`soundtrack.mp3`)
  - Dark / Light (Day) mode toggle (🌙/☀️) with saved preference
  - Responsive grid layout (works on mobile & desktop)
  - Loading states, error messages, and stats counter
  - Reset button to clear all filters and search

- **Technical Highlights**  
  - Pure HTML, CSS, and vanilla JavaScript — no frameworks
  - Safe event handling (clicks work after dynamic content loads)
  - Lazy-loaded images and efficient filtering
  - LocalStorage for theme persistence

## 📁 Files

- `index.html` – Main page structure and layout
- `style.css` – All styling, animations, and day/dark mode
- `script.js` – Full app logic: API fetching, filtering, search, modal, sound, theme
- `background.mp4` – **Required** magical background video (place your own looping Disney-themed video)
- `soundtrack.mp3` – **Optional** background music (any Disney instrumental track)

## 🚀 How to Use

1. Create a folder and save the following files:
   - `index.html`
   - `style.css`
   - `script.js`

2. Add your own media files:
   - `background.mp4` → A looping, atmospheric Disney video (e.g., castle fireworks, enchanted forest)
   - `soundtrack.mp3` → Optional Disney background music (will start muted by default)

3. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

4. Enjoy exploring the magical world of Disney characters!

## 🎨 Customization Tips

- Replace `background.mp4` with any magical looping video (castle at night, underwater scenes, etc.)
- Change `soundtrack.mp3` to your favorite Disney park music or movie score
- The app uses the free public API at `https://disneyapi.dev/` — no API key needed

## 💡 Notes

- The first load fetches characters page by page — "Load More" pulls the next batch
- Some characters may lack images (API limitation) — shown as "No Image"
- Sound requires user interaction to play (browser policy) — click the sound button to enable
- Theme preference (dark/day) is saved in your browser

**Let the magic begin!** ✨🏰

Data provided by [disneyapi.dev](https://disneyapi.dev/)