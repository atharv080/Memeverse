# MemeVerse 🎭

MemeVerse is a modern, interactive web platform for exploring, sharing, and interacting with memes. Built with Next.js and featuring a sleek, responsive design with dark mode support.

## 🚀 Features

### Homepage
- Dynamic trending memes display
- Interactive animations & transitions
- Dark/Light mode toggle
- Responsive design

### Explore Page
- Infinite scrolling meme feed
- Advanced filtering options:
  - Trending
  - New
  - Classic
  - Random
- Search functionality with debounced API calls
- Sort by:
  - Likes
  - Date
  - Comments

### Meme Upload
- Support for image/GIF uploads
- Caption editor
- Preview functionality
- AI-based caption suggestions

### Meme Details
- Dynamic routing (/meme/:id)
- Like/Comment system
- Share functionality
- Interactive animations

### User Profile
- Customizable user profiles
- Uploaded memes gallery
- Liked memes collection
- Profile editing capabilities

### Leaderboard
- Top 10 most liked memes
- User rankings based on engagement
- Real-time updates

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit
- **Data Fetching**: Axios
- **Image Optimization**: Next/Image
- **Type Safety**: TypeScript
- **API Integration**: ImgFlip API

## 🏗️ Project Structure
```bash
src/
├── app/
│ ├── auth/
│ ├── explore/
│ ├── leaderboard/
│ ├── meme/
│ ├── profile/
│ ├── upload/
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ ├── loading.tsx
│ ├── not-found.tsx
│ └── page.tsx
├── components/
│ ├── common/
│ ├── explore/
│ ├── leaderboard/
│ ├── memes/
│ ├── profile/
│ ├── providers/
│ └── upload/
├── hooks/
│ └── useDebounce.ts
├── lib/
│ ├── constants/
│ ├── types/
│ ├── utils/
│ └── utils.ts
├── store/
│ ├── features/
│ ├── hooks.ts
│ ├── provider.tsx
│ └── store.ts
└── types/
```
## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/memeverse.git
cd memeverse
```
2. Install dependencies:
```bash
npm install
# or
yarn install
```
3. Create a .env.local file:
```bash
NEXT_PUBLIC_API_URL=https://api.imgflip.com
```
4. Run the development server:
```bash
npm run dev
# or
yarn dev
```
5. Open http://localhost:3000

## 🎨 Features in Detail
### Infinite Scrolling
- Implemented using Intersection Observer
- Optimized performance with debounced loading
- Smooth animations for loading states
### Dark Mode
- System preference detection
- Persistent user preference
- Smooth transitions
### Responsive Design
- Mobile-first approach
- Breakpoints:
  -Mobile: < 768px
  -Tablet: 768px - 1024px
  -Desktop: > 1024px
###Performance Optimizations
- Image optimization with Next/Image
- Lazy loading components
- Debounced search
- Optimized animations
## 🔧 Configuration
### Next.js Config
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['i.imgflip.com'],
  },
}
```
### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```
## 🚀 Deployment
- The project is deployed on Vercel:
https://atharvmemeverse.vercel.app/

## 🤝 Contributing
- Fork the repository
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## 🙏 Acknowledgments
- Next.js Documentation
- Tailwind CSS
- Framer Motion
- ImgFlip API
## 📞 Contact
- Atharv Singhal - atharvsinghal421@gmail.com

- Project Link: https://atharvmemeverse.vercel.app/
