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
  const [oEmbed, setOEmbed] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (track && note) {
      const url = `/play?track=${encodeURIComponent(track)}&note=${encodeURIComponent(note)}`;
      setLink(window.location.origin + url);
      setShowPreview(true);
      // Fetch oEmbed data
      try {
        const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(track)}`);
        if (res.ok) {
          const data = await res.json();
          setOEmbed(data);
        } else {
          setOEmbed(null);
        }
      } catch {
        setOEmbed(null);
      }
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
      <AppTitle subtitle={'Share a Spotify track with a heartfelt note. Your friend sees your message, then listens instantly!'} />
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
          <div className="w-full max-w-md mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-4 sm:p-6 md:p-8 flex flex-col items-center gap-4 animate-fade-in mb-8 relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{background: 'linear-gradient(120deg, rgba(59,7,100,0.12) 0%, rgba(14,116,144,0.10) 100%)'}}></div>
            {oEmbed && (
              <div className="flex flex-row items-center z-10 w-full mb-4 bg-fuchsia-900/80 rounded-xl p-3 shadow-md">
                <img src={oEmbed.thumbnail_url} alt={oEmbed.title} className="rounded-lg w-20 h-20 object-cover mr-4 flex-shrink-0" />
                <div className="flex flex-col justify-center">
                  <div className="font-bold text-white text-lg mb-1">{oEmbed.title}</div>
                  <div className="text-white text-base">{oEmbed.author_name}</div>
                </div>
              </div>
            )}
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
  const [oEmbed, setOEmbed] = useState(null);

  useEffect(() => {
    setShow(true);
    // Fetch oEmbed data for the track
    if (track) {
      fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(track)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setOEmbed(data))
        .catch(() => setOEmbed(null));
    }
  }, [track]);

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
      <div className="w-full max-w-md mx-4 flex flex-col items-center relative z-10 px-5">
        <div
          className={`w-full p-4 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border-4 border-fuchsia-200/40 mb-8 transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'} animate-fade-in mx-5 sm:mx-0`}
        >
          <div className="text-3xl md:text-4xl font-extrabold text-black text-center mb-2 drop-shadow-sm font-sans">
            {decodeURIComponent(note)}
          </div>
        </div>
        {oEmbed && (
          <a
            href={track}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center w-full mb-8 bg-black/30 border border-white rounded-2xl p-4 shadow-md transition hover:bg-black/50 cursor-pointer group"
            style={{ textDecoration: 'none' }}
          >
            <img src={oEmbed.thumbnail_url} alt={oEmbed.title} className="rounded-xl w-20 h-20 object-cover mr-4 flex-shrink-0" />
            <div className="flex flex-col justify-center flex-1">
              <div className="font-bold text-white text-lg mb-1 truncate max-w-[12rem]" style={{textShadow: '0 1px 4px rgba(0,0,0,0.3)'}}>{oEmbed.title}</div>
              <div className="text-white text-base mb-2 truncate" style={{textShadow: '0 1px 4px rgba(0,0,0,0.3)'}}>{oEmbed.author_name}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-400 ml-2 group-hover:scale-110 transition-transform">
              <circle cx="12" cy="12" r="12" fill="#1DB954"/>
              <polygon points="10,8 16,12 10,16" fill="#fff" />
            </svg>
          </a>
        )}
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
