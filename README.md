# Meditation Mixer

A web application that allows users to mix music tracks with binaural beats for meditation and relaxation.

## Features

- **Automatic Audio Detection**: Just drop audio files in the folders and they appear in the app!
- Select from a variety of music tracks
- Choose from different binaural beat frequencies
- Adjust volume levels independently
- Play both tracks simultaneously
- Responsive design that works on all devices

## Tech Stack

- Next.js 14+ (App Router)
- React 18
- TypeScript
- Tailwind CSS
- File System API (no database needed!)
- Vercel (for deployment)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/meditation-mixer.git
   cd meditation-mixer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Add Your Audio Files**:
   - Place your music files in: `public/audio/music/`
   - Place your binaural beat files in: `public/audio/binaural/`
   - Supported formats: `.mp3`, `.wav`, `.ogg`
   - **That's it!** The app will automatically detect and list all files.

### Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Add New Tracks

### Adding Music Tracks
1. Copy your music file (e.g., `relaxing-piano.mp3`) to `public/audio/music/`
2. Refresh the app - it will appear in the Music Track dropdown automatically!

### Adding Binaural Beats
1. Copy your binaural beat file (e.g., `7.83Hz Binaural Beat.mp3`) to `public/audio/binaural/`
2. Refresh the app - it will appear in the Binaural Beat dropdown automatically!

**No database, no manual entries, no configuration needed!**

### Deployment

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Deploy!

**Note**: Your audio files in the `public` folder will be deployed with your app.

## File Structure

```
meditation-mixer/
├── public/
│   └── audio/
│       ├── music/          # Put your music files here
│       └── binaural/       # Put your binaural beats here
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── audio/
│   │   │       └── route.ts  # API that scans audio folders
│   │   ├── page.tsx          # Main mixer interface
│   │   └── layout.tsx
│   └── lib/
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
