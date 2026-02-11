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
  const [musicProgress, setMusicProgress] = useState<number>(0);
  const [binauralProgress, setBinauralProgress] = useState<number>(0);
  const [musicCurrentTime, setMusicCurrentTime] = useState<number>(0);
  const [binauralCurrentTime, setBinauralCurrentTime] = useState<number>(0);
  const [musicDuration, setMusicDuration] = useState<number>(0);
  const [binauralDuration, setBinauralDuration] = useState<number>(0);
  
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

  useEffect(() => {
    const musicAudio = musicRef.current;
    const binauralAudio = binauralRef.current;

    const updateMusicProgress = () => {
      if (musicAudio) {
        const progress = (musicAudio.currentTime / musicAudio.duration) * 100;
        setMusicProgress(progress || 0);
        setMusicCurrentTime(musicAudio.currentTime);
      }
    };

    const updateBinauralProgress = () => {
      if (binauralAudio) {
        const progress = (binauralAudio.currentTime / binauralAudio.duration) * 100;
        setBinauralProgress(progress || 0);
        setBinauralCurrentTime(binauralAudio.currentTime);
      }
    };

    const setMusicDurationHandler = () => {
      if (musicAudio) setMusicDuration(musicAudio.duration);
    };

    const setBinauralDurationHandler = () => {
      if (binauralAudio) setBinauralDuration(binauralAudio.duration);
    };

    if (musicAudio) {
      musicAudio.addEventListener('timeupdate', updateMusicProgress);
      musicAudio.addEventListener('loadedmetadata', setMusicDurationHandler);
    }

    if (binauralAudio) {
      binauralAudio.addEventListener('timeupdate', updateBinauralProgress);
      binauralAudio.addEventListener('loadedmetadata', setBinauralDurationHandler);
    }

    return () => {
      if (musicAudio) {
        musicAudio.removeEventListener('timeupdate', updateMusicProgress);
        musicAudio.removeEventListener('loadedmetadata', setMusicDurationHandler);
      }
      if (binauralAudio) {
        binauralAudio.removeEventListener('timeupdate', updateBinauralProgress);
        binauralAudio.removeEventListener('loadedmetadata', setBinauralDurationHandler);
      }
    };
  }, [selectedMusic, selectedBinaural]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMusicSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!musicRef.current || !musicDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * musicDuration;
    musicRef.current.currentTime = newTime;
  };

  const handleBinauralSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!binauralRef.current || !binauralDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * binauralDuration;
    binauralRef.current.currentTime = newTime;
  };

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
              
              {selectedMusicTrack && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{formatTime(musicCurrentTime)}</span>
                    <span>{formatTime(musicDuration)}</span>
                  </div>
                  <div 
                    className="w-full bg-gray-200 rounded-full h-2 cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={handleMusicSeek}
                  >
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300 pointer-events-none"
                      style={{ width: `${musicProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
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
              
              {selectedBinauralTrack && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{formatTime(binauralCurrentTime)}</span>
                    <span>{formatTime(binauralDuration)}</span>
                  </div>
                  <div 
                    className="w-full bg-gray-200 rounded-full h-2 cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={handleBinauralSeek}
                  >
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300 pointer-events-none"
                      style={{ width: `${binauralProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
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
