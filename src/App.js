import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

function getQueryParams(search) {
  const params = new URLSearchParams(search);
  return {
    track: params.get('track'),
    note: params.get('note'),
  };
}

function getSpotifyCodeUrl(trackUrl) {
  // Convert a Spotify web URL to a Spotify URI (e.g., https://open.spotify.com/track/xyz -> spotify:track:xyz)
  try {
    const url = new URL(trackUrl);
    const parts = url.pathname.split('/');
    if (parts[1] === 'track' && parts[2]) {
      return `https://scannables.scdn.co/uri/plain/png/white/black/640/spotify:track:${parts[2]}`;
    }
    if (parts[1] === 'playlist' && parts[2]) {
      return `https://scannables.scdn.co/uri/plain/png/white/black/640/spotify:playlist:${parts[2]}`;
    }
    if (parts[1] === 'album' && parts[2]) {
      return `https://scannables.scdn.co/uri/plain/png/white/black/640/spotify:album:${parts[2]}`;
    }
    // fallback: encode the full URL as a URI
    return `https://scannables.scdn.co/uri/plain/png/white/black/640/${encodeURIComponent(trackUrl)}`;
  } catch {
    return null;
  }
}

function AppTitle({ subtitle }) {
  return (
    <div className="flex flex-col items-center w-full">
      <img
        src={require('./notedrop-logo.png')}
        alt="notedrop logo"
        className="w-72 md:w-96 mx-auto mb-4 mt-6 drop-shadow-lg select-none"
        draggable="false"
      />
      <p className="max-w-xl text-center text-lg md:text-xl font-sans font-medium text-white mb-8" style={{ fontFamily: 'Nunito, sans-serif' }}>
        {subtitle}
      </p>
    </div>
  );
}

function AnimatedEmojis() {
  // Array of emojis, sizes, delays, and left positions
  const emojis = [
    { emoji: '💌', delay: 'emoji-float-delay-1', left: '10%', size: '2.2rem' },
    { emoji: '💖', delay: 'emoji-float-delay-2', left: '20%', size: '2.8rem' },
    { emoji: '💚', delay: 'emoji-float-delay-3', left: '30%', size: '2.4rem' },
    { emoji: '💙', delay: 'emoji-float-delay-1', left: '40%', size: '2.6rem' },
    { emoji: '💜', delay: 'emoji-float-delay-2', left: '50%', size: '3.2rem' },
    { emoji: '💛', delay: 'emoji-float-delay-3', left: '60%', size: '2.1rem' },
    { emoji: '💕', delay: 'emoji-float-delay-1', left: '70%', size: '2.7rem' },
    { emoji: '💝', delay: 'emoji-float-delay-2', left: '80%', size: '2.3rem' },
    { emoji: '💟', delay: 'emoji-float-delay-3', left: '25%', size: '2.9rem' },
    { emoji: '💗', delay: 'emoji-float-delay-1', left: '55%', size: '2.5rem' },
    { emoji: '💓', delay: 'emoji-float-delay-2', left: '75%', size: '2.2rem' },
    { emoji: '💞', delay: 'emoji-float-delay-3', left: '85%', size: '2.6rem' },
    { emoji: '💌', delay: 'emoji-float-delay-2', left: '35%', size: '2.0rem' },
    { emoji: '💖', delay: 'emoji-float-delay-3', left: '65%', size: '3.0rem' },
  ];
  return (
    <>
      {emojis.map((e, i) => (
        <span
          key={i}
          className={`emoji-float ${e.delay}`}
          style={{ left: e.left, fontSize: e.size }}
        >
          {e.emoji}
        </span>
      ))}
    </>
  );
}

function LandingPage() {
  const [track, setTrack] = useState('');
  const [note, setNote] = useState('');
  const [link, setLink] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();
    if (track && note) {
      const url = `/play?track=${encodeURIComponent(track)}&note=${encodeURIComponent(note)}`;
      setLink(window.location.origin + url);
      setShowPreview(true);
    }
  };

  const handleGo = () => {
    if (track && note) {
      navigate(`/play?track=${encodeURIComponent(track)}&note=${encodeURIComponent(note)}`);
    }
  };

  const handleCopy = () => {
    if (link) {
      navigator.clipboard.writeText(link);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-animated-dark animate-gradient-x overflow-hidden relative">
      <AnimatedEmojis />
      <AppTitle subtitle={showPreview && link ? "Someone's thinking of you and sent you this track and note! Share a Spotify track with a heartfelt note." : 'Share a Spotify track with a heartfelt note. Your friend sees your message, then listens instantly—plus, they can scan the Spotify code to open the song in their app!'} />
      <div className="w-full max-w-md mx-4 flex flex-col items-center relative z-10">
        <form
          className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border-4 border-fuchsia-200/40 hover:shadow-fuchsia-200 transition-shadow duration-300"
          onSubmit={handleGenerate}
        >
          <div className="mb-4">
            <label className="block text-lg font-bold text-fuchsia-700 mb-2 font-sans tracking-wide">Spotify Track URL</label>
            <input
              type="url"
              className="w-full px-4 py-2 rounded-xl border border-black focus:ring-4 focus:ring-gray-800 outline-none bg-fuchsia-50/40 text-fuchsia-900 font-semibold placeholder-fuchsia-300 font-sans"
              placeholder="https://open.spotify.com/track/..."
              value={track}
              onChange={e => setTrack(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-bold text-fuchsia-700 mb-2 font-sans tracking-wide">Note</label>
            <textarea
              className="w-full px-4 py-2 rounded-xl border border-black focus:ring-4 focus:ring-gray-800 outline-none text-base bg-orange-50/40 text-fuchsia-900 placeholder-fuchsia-300 font-sans"
              placeholder="Type your note..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-black text-white text-lg font-extrabold shadow-lg transition-all duration-200 drop-shadow-md hover:bg-gray-900"
            >
              🎉 Generate Link
            </button>
            <button
              type="button"
              onClick={handleGo}
              className="px-6 py-3 rounded-full bg-white border-2 border-black text-black text-lg font-bold shadow-md hover:bg-gray-100 transition-colors duration-200"
            >
              👀 Preview Note
            </button>
          </div>
        </form>
        {showPreview && link && (
          <div className="w-full max-w-md mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 flex flex-col items-center gap-4 animate-fade-in mb-8 relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{background: 'linear-gradient(120deg, rgba(59,7,100,0.12) 0%, rgba(14,116,144,0.10) 100%)'}}></div>
            <div className="flex items-center w-full gap-2 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-fuchsia-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v10.5A2.25 2.25 0 0113.5 21h-3a2.25 2.25 0 01-2.25-2.25V9m7.5 0H8.25" />
              </svg>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 rounded-xl border border-black bg-white/70 text-fuchsia-700 font-sans text-base focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition-all cursor-pointer truncate hover:bg-fuchsia-50 hover:text-fuchsia-900"
                style={{ textDecoration: 'none' }}
                title={link}
              >
                {link}
              </a>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold font-sans shadow transition-colors duration-200"
              >
                📋 Copy
              </button>
            </div>
            <div className="text-xs text-fuchsia-900/80 font-sans z-10">Share this link with someone you care about!</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { track, note } = getQueryParams(location.search);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!track || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-animated-dark animate-gradient-x overflow-hidden relative">
        <div className="text-center p-8 bg-white/70 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="text-2xl font-sans text-rose-600 mb-2">Missing track or note.</div>
          <div className="text-lg text-gray-500">Please provide both <code>track</code> and <code>note</code> query parameters.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-animated-dark animate-gradient-x overflow-hidden relative">
      <AnimatedEmojis />
      <AppTitle subtitle={"Someone's thinking of you and sent you this track and note! Share a Spotify track with a heartfelt note."} />
      <div className="w-full max-w-md mx-4 flex flex-col items-center relative z-10">
        <div
          className={`w-full p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border-4 border-fuchsia-200/40 mb-8 transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'} animate-fade-in`}
        >
          <div className="text-3xl md:text-4xl font-extrabold text-fuchsia-700 text-center mb-2 drop-shadow-sm font-sans">
            {decodeURIComponent(note)}
          </div>
        </div>
        <a
          href={track}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 rounded-full bg-black text-white text-xl font-extrabold shadow-lg transition-all duration-200 mb-4 drop-shadow-md font-sans hover:bg-gray-900 flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-green-400">
            <circle cx="12" cy="12" r="12" fill="#1DB954"/>
            <path d="M17.25 16.08a.75.75 0 0 1-1.03.23c-2.82-1.73-6.38-2.12-10.59-1.15a.75.75 0 1 1-.33-1.46c4.56-1.04 8.47-.6 11.6 1.25a.75.75 0 0 1 .23 1.13zm1.48-2.7a.94.94 0 0 1-1.29.29c-3.23-2-8.16-2.59-11.98-1.4a.94.94 0 1 1-.56-1.8c4.23-1.32 9.6-.68 13.23 1.6.44.27.57.85.29 1.31zm.13-2.82C15.1 8.2 8.9 8.01 5.7 9.01a1.13 1.13 0 1 1-.67-2.16c3.7-1.15 10.5-.93 14.38 1.77a1.13 1.13 0 0 1-1.2 1.94z" fill="#fff"/>
          </svg>
          Play in Spotify
        </a>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 rounded-full bg-black text-white text-lg font-extrabold shadow-lg transition-all duration-200 drop-shadow-md font-sans hover:bg-gray-900"
        >
          Send a note and track
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/play" element={<PlayPage />} />
    </Routes>
  );
}

export default App;
