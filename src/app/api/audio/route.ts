import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type || (type !== 'music' && type !== 'binaural')) {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  }

  const audioDir = path.join(process.cwd(), 'public', 'audio', type);
  
  try {
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(audioDir);
    const audioFiles = files
      .filter(file => {
        const ext = file.toLowerCase();
        return ext.endsWith('.mp3') || ext.endsWith('.wav') || ext.endsWith('.ogg') || ext.endsWith('.m4a');
      })
      .filter(file => !file.startsWith('.'))
      .map(file => {
        const name = file.replace(/\.[^/.]+$/, '');
        return {
          id: file,
          name: name,
          file_url: `/audio/${type}/${encodeURIComponent(file)}`
        };
      });

    return NextResponse.json(audioFiles);
  } catch (error) {
    console.error('Error reading audio directory:', error);
    return NextResponse.json({ error: 'Failed to read audio files' }, { status: 500 });
  }
}
