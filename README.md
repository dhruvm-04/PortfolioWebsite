# Portfolio Website

A personal portfolio website for Dhruv Maheshwari built as a fast, single-page static site. It presents an introduction, background, professional experience, projects, and extracurricular highlights in a polished scrolling layout.

## Features

- Full-screen hero section with animated landing experience
- About, Experience, Projects, and Extracurricular sections
- Smooth scrolling and motion effects powered by client-side libraries
- Responsive layout designed for desktop and mobile browsing
- Optimized for static deployment on Vercel

## Tech Stack

- HTML5
- CSS3
- JavaScript
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling
- [Anime.js](https://animejs.com/) for animations

## Project Structure

- `index.html` - main portfolio page and all site styling/interaction logic
- `public/` - static assets used by the site
- `vercel.json` - deployment configuration for Vercel

## Running Locally

You can open `index.html` directly in a browser, or serve the folder with any local static server.

Example with Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deployment

This project is configured for Vercel through `vercel.json`. Connect the repository to Vercel or deploy the static folder directly.

## Notes

This repository is intended to be the source of truth for the portfolio hosted at `PortfolioWebsite`.
