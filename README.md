# OmniTools - Modern, Responsive All-in-One Tools Website

> **Professional, privacy-first, 100% client-side multi-tool web application built with HTML5, CSS3, and vanilla JavaScript.**

---

## 🌟 Project Overview

**OmniTools** is a production-ready, fully responsive web application delivering five high-utility online tools that process data directly inside the user's web browser. It requires **zero backend servers**, **no paid APIs**, **no API keys**, and **no user account registrations**.

### Core Philosophy:
- **100% Client-Side Privacy:** Images, text documents, and JSON payloads remain in local browser memory and are never transmitted to external servers.
- **Modern Design System:** Built with custom CSS design tokens (variables), sleek glassmorphism, responsive flex/grid layouts, and instant Dark / Light mode switching.
- **Zero Framework Bloat:** Fast and lightweight with vanilla JavaScript, modern Canvas API, and zero heavy runtime dependencies.
- **Google AdSense Ready:** Features complete legal compliance pages (Privacy Policy, Terms, Disclaimer, Cookie Policy), designated non-intrusive ad unit slots, and a standard `ads.txt` placeholder.

---

## 🛠️ Included Tools

### 1. Word Counter (`word-counter.html`)
- Instant real-time calculation as you type or paste.
- Counts **Words**, **Characters (with spaces)**, **Characters (without spaces)**, **Sentences**, and **Paragraphs**.
- Calculates estimated **Reading Time** (200 wpm) and **Speaking Time** (130 wpm).
- One-click text transforms: `UPPERCASE`, `lowercase`, `Title Case`, `Sentence case`, and **Clean Spaces** (removes redundant spacing and blank lines).
- Clipboard utilities: Copy text, Paste from clipboard, Clear, and Load Sample Text.

### 2. Image Resizer (`image-resizer.html`)
- Drag-and-drop zone and standard file picker supporting PNG, JPG, WebP, GIF, and SVG.
- Live canvas preview displaying original dimensions, target dimensions, and estimated file size.
- Custom width and height pixel inputs with a **Maintain Aspect Ratio** lock toggle.
- Quick scale presets: `25%`, `50%`, `75%`, `100%`, `1920x1080 (1080p)`, and `Square 1:1`.
- Format selector: **PNG (Lossless)**, **JPEG**, or modern **WebP (Compressed)** with an adjustable quality slider (10% to 100%).
- High-quality bicubic interpolation using the HTML5 Canvas API. Automatic object URL cleanup to prevent memory leaks.

### 3. Percentage Calculator (`percentage-calculator.html`)
- Four distinct calculation modes in clean responsive cards:
  1. **What is P% of X?** (Calculate tips, sales tax, commissions).
  2. **X is what percent of Y?** (Calculate test scores, ratios).
  3. **Percentage Increase / Decrease from X to Y** (Calculate growth, inflation, decline).
  4. **Add or Subtract P% from X** (Add retail markups, subtract sale discounts).
- Live evaluation with division-by-zero protection and handling for negative values and decimals.
- Step-by-step mathematical formula explanations rendered under every result.
- Copy result buttons, preset example loader, and a global reset button.

### 4. JSON Formatter & Validator (`json-formatter.html`)
- Dual-pane layout: Raw Input JSON on the left, Formatted / Minified Output on the right.
- Format / Beautify with customizable indentation: **2 spaces**, **4 spaces**, or **Tabs**.
- Minify / Compact option to strip all whitespace for efficient network payloads.
- Live syntax validation with exact error messages and visual status indicator (`Valid JSON`, `Invalid JSON`, `Waiting for input`).
- Character and byte size comparison counters.
- One-click copy output, clear, load sample JSON, and download formatted file as `.json`.

### 5. QR Code Generator (`qr-generator.html`)
- Encodes URLs, plain text, WiFi credentials, email links, and phone numbers.
- Live generation powered by an open-source, bundled, zero-dependency client-side QR engine (`js/vendor/qrcode.min.js`). Zero external API calls!
- Selectable resolutions: `128x128`, `256x256`, `384x384`, `512x512`.
- Configurable Reed-Solomon Error Correction Level: `Low (7%)`, `Medium (15%)`, `Quartile (25%)`, `High (30% - Recommended)`.
- Custom color pickers for Foreground (pattern) and Background.
- Instant PNG image download and Copy Image to Clipboard support.

---

## 📁 Project Directory Structure

```
multi-tool-website/
├── index.html                  # Modern animated homepage
├── tools.html                  # Complete tools catalog with category filters
├── word-counter.html           # Tool 1: Word & Character Counter
├── image-resizer.html          # Tool 2: Canvas Image Resizer
├── percentage-calculator.html  # Tool 3: Multi-Mode Percentage Calculator
├── json-formatter.html         # Tool 4: JSON Formatter & Validator
├── qr-generator.html           # Tool 5: High-Resolution QR Generator
├── about.html                  # Original mission & architecture page
├── contact.html                # Contact page with validated feedback form
├── privacy-policy.html         # GDPR / CCPA compliant privacy disclosure
├── terms.html                  # Terms and Conditions of service
├── disclaimer.html             # Legal, financial, and technical disclaimer
├── cookie-policy.html          # Storage tokens & advertising cookie policy
├── sitemap.html                # User-friendly HTML sitemap
├── 404.html                    # Branded custom 404 error page
├── robots.txt                  # Search engine crawler directives
├── sitemap.xml                 # Search engine XML sitemap
├── ads.txt                     # Google AdSense publisher verification record
├── css/
│   └── style.css               # Main CSS stylesheet with Dark/Light variables
├── js/
│   ├── theme.js                # Theme switcher & system preference detection
│   ├── common.js               # Shared navigation, accordions, toasts, cookies
│   ├── home.js                 # Real-time search and category filtering
│   ├── word-counter.js         # Word Counter logic
│   ├── image-resizer.js        # Canvas Image Resizer logic
│   ├── percentage-calculator.js# Percentage Calculator math engine
│   ├── json-formatter.js       # JSON validator and beautifier
│   ├── qr-generator.js         # QR code generator controller
│   └── vendor/
│       └── qrcode.min.js       # Pure JS client-side QR code generator
└── README.md                   # Complete documentation & deployment guide
```

---

## 🚀 Running the Project Locally

Because OmniTools is built purely with static HTML5, CSS3, and JavaScript, you can run it immediately without compiling, installing npm packages, or configuring a database.

### Option 1: Direct File Opening
Double-click `index.html` to open it in any modern browser (Chrome, Firefox, Safari, Edge).

### Option 2: Using VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The site will launch automatically at `http://127.0.0.1:5500`.

### Option 3: Using Python Built-in Server
Open PowerShell or your terminal inside the project directory:
```powershell
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option 4: Using Node.js `serve` or `http-server`
```powershell
npx serve .
```

---

## ☁️ Deployment Guide (Free Static Hosting)

OmniTools is 100% compatible with any static hosting platform or CDN.

### Deploying to Cloudflare Pages (Recommended)
1. Push your repository to **GitHub** or **GitLab**.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
3. Click **Create Application** &gt; **Pages** &gt; **Connect to Git**.
4. Select your repository.
5. In the build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `.` (root directory)
6. Click **Save and Deploy**. Your site will be globally live with free SSL and edge caching in under 30 seconds!

### Deploying to GitHub Pages
1. Push the repository to GitHub.
2. Go to **Settings** &gt; **Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then click **Save**.

### Deploying to Netlify
- Drag and drop the `multi-tool-website` folder directly into [Netlify Drop](https://app.netlify.com/drop).

---

## ⚙️ Customization Checklist

Before deploying to your production domain, customize the following placeholders:

1. **Domain Name:**
   - Search across files for `https://example.com` and replace with your actual domain (e.g. `https://yourdomain.com`).
   - Updates needed in: `<link rel="canonical">`, `<meta property="og:url">`, `robots.txt`, and `sitemap.xml`.
2. **Contact Email:**
   - Replace `support@example.com` in `contact.html`, `about.html`, `privacy-policy.html`, and footers with your real email.
3. **Social Links:**
   - Update the footer social links (`facebook.com`, `x.com`, `github.com`, `youtube.com`) with your profile URLs.
4. **Google AdSense Configuration:**
   - Open `ads.txt` and replace `pub-0000000000000000` with your verified AdSense publisher ID.
   - Insert your official Google AdSense `<script>` tag into the `<head>` of your HTML pages once approved.
   - Replace `.ad-slot-placeholder` elements with your responsive AdSense `<ins class="adsbygoogle">` ad units.

---

## 🔒 Security & Privacy Highlights
- **No Private Data Uploads:** User images, JSON payloads, and notes remain strictly within the browser tab's local sandbox memory.
- **Secure Storage:** Uses modern `localStorage` for theme preferences only; no sensitive tokens or passwords stored.
- **Memory Safety:** Automatically revokes canvas Blob URLs (`URL.revokeObjectURL`) to prevent memory leaks during heavy image resizing operations.
- **Input Sanitization:** All text inputs and calculations are validated to prevent cross-site scripting (XSS) or application crashes.

---

## 📄 License
This project is open-source and released under the **MIT License**.
