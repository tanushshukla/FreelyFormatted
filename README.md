# FreelyFormatted - FreeFormatter.com Clone

A complete 1:1 clone of FreeFormatter.com featuring 40+ developer tools with an artistic black and white UI. Built with React, TypeScript, and Vite.

## 🌐 Live Demo

**Hosted on Vercel:** [https://trae11b19bfy-1w1b3gg8v-tanushdroid-9992s-projects.vercel.app](https://trae11b19bfy-1w1b3gg8v-tanushdroid-9992s-projects.vercel.app)

## ✨ Features

### 🛠️ Tool Categories (40+ Tools)

- **JSON Tools** - Formatter, Validator, Minifier, Viewer
- **XML/HTML Tools** - Formatter, Validator, Minifier, Encoder/Decoder
- **Code Tools** - JavaScript/CSS/SQL Formatter, Minifier, Beautifier
- **Converters** - JSON↔YAML, JSON↔CSV, XML↔JSON, Base64, URL encoding
- **Encoders/Crypto** - MD5, SHA1/256/512, AES encryption, JWT decoder, QR codes
- **Utilities** - Text case converter, word count, regex tester, password generator, UUID generator
- **Web Resources** - Email/URL/credit card validators, Lorem Ipsum generator

### 🎨 Design Features

- **Artistic Black & White UI** - Modern, clean, professional design
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Collapsible Sidebar** - Easy navigation with 40+ tools organized by category
- **Direct Tool Links** - Click any tool in sidebar to open it immediately
- **Real-time Processing** - Instant formatting and validation
- **File Upload Support** - Process files directly in the browser
- **Search Functionality** - Find tools quickly

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd FreelyFormatted

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🐳 Docker Self-Hosting

For easy self-hosting, use the provided Docker setup:

```bash
# Clone the repository
git clone <repository-url>
cd FreelyFormatted

# Build and run with Docker Compose
docker-compose up -d

# Access the application
open http://localhost:3000
```

### Docker Configuration

- **Multi-stage build** with Node.js and serve
- **Production-optimized** static file serving
- **Health checks** for container monitoring
- **Automatic restart** on failure
- **Non-root user** for security
- **Ready for reverse proxy** - no built-in web server configuration

### Reverse Proxy Setup

The Docker container serves the app on port 3000. Configure your reverse proxy (nginx, traefik, etc.) to forward requests:

```nginx
# Example nginx configuration
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── Empty.tsx       # Empty state component
├── pages/              # Tool category pages
│   ├── JsonTools.tsx   # JSON formatting tools
│   ├── XmlHtmlTools.tsx# XML/HTML tools
│   ├── CodeTools.tsx   # Code formatting tools
│   ├── Converters.tsx  # Data conversion tools
│   ├── EncodersCrypto.tsx # Encoding/crypto tools
│   ├── Utilities.tsx   # Text utilities
│   └── Home.tsx        # Landing page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** Zustand
- **Libraries:** 
  - `crypto-js` - Cryptographic functions
  - `js-yaml` - YAML parsing
  - `papaparse` - CSV parsing
  - `qrcode` - QR code generation
  - `validator` - Data validation
  - `lucide-react` - Icons

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run check` - Type check and lint

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note:** This is a clone/tribute to FreeFormatter.com built for educational purposes and to demonstrate modern web development practices.
