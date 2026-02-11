'use client';

import { useState, useEffect, useRef } from 'react';

interface AudioTrack {
  id: string;
  name: string;
  file_url: string;
}

export default function MeditationMixer() {
  const [musicTracks, setMusicTracks] = useState<AudioTrack[]>([]);
  const [binauralTracks, setBinauralTracks] = useState<AudioTrack[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string>('');
  const [selectedBinaural, setSelectedBinaural] = useState<string>('');
  const [musicVolume, setMusicVolume] = useState<number>(50);
  const [binauralVolume, setBinauralVolume] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const musicRef = useRef<HTMLAudioElement>(null);
  const binauralRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function loadTracks() {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch('/audio-list.json');
        
        if (!response.ok) {
          throw new Error('Failed to load audio tracks');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data.music)) setMusicTracks(data.music);
        if (Array.isArray(data.binaural)) setBinauralTracks(data.binaural);
        
        if (data.music.length > 0) setSelectedMusic(data.music[0].id);
        if (data.binaural.length > 0) setSelectedBinaural(data.binaural[0].id);
      } catch (err) {
        console.error('Error loading tracks:', err);
        setError('Failed to load audio tracks. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTracks();
  }, []);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  useEffect(() => {
    if (binauralRef.current) {
      binauralRef.current.volume = binauralVolume / 100;
    }
  }, [binauralVolume]);

  const togglePlayback = async () => {
    if (!selectedMusicTrack && !selectedBinauralTrack) {
      setError('Please select at least one audio track');
      return;
    }

    try {
      if (isPlaying) {
        if (musicRef.current) musicRef.current.pause();
        if (binauralRef.current) binauralRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromises = [];
        if (musicRef.current && selectedMusicTrack) {
          playPromises.push(musicRef.current.play());
        }
        if (binauralRef.current && selectedBinauralTrack) {
          playPromises.push(binauralRef.current.play());
        }
        await Promise.all(playPromises);
        setIsPlaying(true);
        setError('');
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const selectedMusicTrack = musicTracks.find(track => track.id === selectedMusic);
  const selectedBinauralTrack = binauralTracks.find(track => track.id === selectedBinaural);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Meditation Mixer</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading audio tracks...</p>
          </div>
        ) : musicTracks.length === 0 && binauralTracks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No audio files found.</p>
            <p className="text-sm text-gray-500">Add audio files to:</p>
            <p className="text-sm text-gray-500 font-mono mt-2">public/audio/music/</p>
            <p className="text-sm text-gray-500 font-mono">public/audio/binaural/</p>
          </div>
        ) : (
          <>
        
            {/* Music Track Selector */}
            <div className="mb-6">
              <label htmlFor="music-select" className="block text-sm font-medium text-gray-700 mb-2">
                Music Track {musicTracks.length === 0 && <span className="text-red-500">(No tracks available)</span>}
              </label>
              <select
                id="music-select"
                value={selectedMusic}
                onChange={(e) => setSelectedMusic(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                disabled={musicTracks.length === 0}
              >
                {musicTracks.length === 0 ? (
                  <option>No music tracks available</option>
                ) : (
                  musicTracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))
                )}
              </select>
              
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Volume: {musicVolume}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(Number(e.target.value))}
                    className="w-3/4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={musicTracks.length === 0}
                  />
                </div>
              </div>
            </div>

            {/* Binaural Beat Selector */}
            <div className="mb-8">
              <label htmlFor="binaural-select" className="block text-sm font-medium text-gray-700 mb-2">
                Binaural Beat {binauralTracks.length === 0 && <span className="text-red-500">(No tracks available)</span>}
              </label>
              <select
                id="binaural-select"
                value={selectedBinaural}
                onChange={(e) => setSelectedBinaural(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                disabled={binauralTracks.length === 0}
              >
                {binauralTracks.length === 0 ? (
                  <option>No binaural tracks available</option>
                ) : (
                  binauralTracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))
                )}
              </select>
              
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Volume: {binauralVolume}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={binauralVolume}
                    onChange={(e) => setBinauralVolume(Number(e.target.value))}
                    className="w-3/4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={binauralTracks.length === 0}
                  />
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex justify-center">
              <button
                onClick={togglePlayback}
                disabled={musicTracks.length === 0 && binauralTracks.length === 0}
                className={`px-6 py-3 rounded-full text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  musicTracks.length === 0 && binauralTracks.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isPlaying
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>

            {/* Hidden Audio Elements */}
            {selectedMusicTrack && (
              <audio
                ref={musicRef}
                src={selectedMusicTrack.file_url}
                loop
                preload="auto"
                onError={() => setError('Failed to load music track')}
              />
            )}
            {selectedBinauralTrack && (
              <audio
                ref={binauralRef}
                src={selectedBinauralTrack.file_url}
                loop
                preload="auto"
                onError={() => setError('Failed to load binaural track')}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
