const fs = require('fs');
const path = require('path');

function getAudioFiles(dir) {
  try {
    if (!fs.existsSync(dir)) {
      return [];
    }
    
    const files = fs.readdirSync(dir);
    return files
      .filter(file => {
        const ext = file.toLowerCase();
        return (ext.endsWith('.mp3') || ext.endsWith('.wav') || ext.endsWith('.ogg') || ext.endsWith('.m4a')) && !file.startsWith('.');
      })
      .map(file => {
        const name = file.replace(/\.[^/.]+$/, '');
        return {
          id: file,
          name: name,
          file_url: `/audio/${path.basename(dir)}/${encodeURIComponent(file)}`
        };
      });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

const musicDir = path.join(process.cwd(), 'public', 'audio', 'music');
const binauralDir = path.join(process.cwd(), 'public', 'audio', 'binaural');

const audioData = {
  music: getAudioFiles(musicDir),
  binaural: getAudioFiles(binauralDir)
};

const outputPath = path.join(process.cwd(), 'public', 'audio-list.json');
fs.writeFileSync(outputPath, JSON.stringify(audioData, null, 2));

console.log('Audio list generated successfully!');
console.log(`Music tracks: ${audioData.music.length}`);
console.log(`Binaural tracks: ${audioData.binaural.length}`);
