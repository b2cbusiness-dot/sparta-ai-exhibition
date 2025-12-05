import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, ExternalLink } from 'lucide-react';

const COURSE_URL = 'https://bit.ly/48PviDn';
import { Artwork, INITIAL_ARTWORKS } from './types';
import Gallery from './pages/Gallery';
import Submission from './pages/Submission';
import ArtworkDetail from './pages/ArtworkDetail';
import { supabase } from './services/supabaseClient';

// Global Context for Artworks
interface AppContextType {
  artworks: Artwork[];
  addArtwork: (artwork: Artwork) => void;
  toggleVote: (id: string) => Promise<boolean>; // returns true if voted, false if unvoted
  checkUserVoted: (id: string) => boolean;
  trackShare: (id: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
       {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="SPARTA Club" className="h-8" />
          </Link>
          <a 
            href={COURSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-sparta-red hover:text-sparta-red-dark"
          >
            강의 보기
            <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full p-4">
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/submit" element={<Submission />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
        </Routes>
      </main>

      {/* Bottom Nav - Both Mobile & Desktop */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="max-w-4xl mx-auto flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/' || location.pathname.startsWith('/artwork') ? 'text-sparta-red' : 'text-slate-400'}`}>
            <Home size={24} />
            <span className="text-xs mt-1">갤러리</span>
          </Link>
          <a 
            href={COURSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-sparta-red transition-colors"
          >
            <ExternalLink size={24} />
            <span className="text-xs mt-1">강의 보기</span>
          </a>
        </div>
      </nav>

    </div>
  );
};

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching artworks:', error);
        return;
      }

      if (data) {
        // Map Supabase columns (snake_case) to Artwork interface (camelCase)
        const mappedArtworks: Artwork[] = data.map((item: any) => ({
          id: item.id,
          imageUrl: item.image_url,
          mediaType: item.media_type as 'image' | 'video',
          authorName: item.author_name,
          authorAgeGroup: item.author_age_group,
          votes: item.votes,
          shares: item.shares || 0,
          timestamp: new Date(item.created_at).getTime(),
        }));
        setArtworks(mappedArtworks);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();

    // Optional: Realtime subscription could be added here
  }, []);

  const addArtwork = (artwork: Artwork) => {
    // Optimistic update
    setArtworks(prev => [artwork, ...prev]);
    // In reality, Submission.tsx handles the DB insert, so we might just refetch
    fetchArtworks();
  };

  const toggleVote = async (id: string): Promise<boolean> => {
    const votedList = JSON.parse(localStorage.getItem('votedArtworks') || '[]');
    const hasVoted = votedList.includes(id);
    const currentArtwork = artworks.find(a => a.id === id);
    
    if (!currentArtwork) return false;

    if (hasVoted) {
      // Remove vote
      const newVotedList = votedList.filter((artId: string) => artId !== id);
      localStorage.setItem('votedArtworks', JSON.stringify(newVotedList));
      
      // Optimistic UI Update (decrease)
      setArtworks(prev => prev.map(art => 
        art.id === id ? { ...art, votes: Math.max(0, art.votes - 1) } : art
      ));
      
      // Update Supabase
      await supabase
        .from('artworks')
        .update({ votes: Math.max(0, currentArtwork.votes - 1) })
        .eq('id', id);
      
      return false; // unvoted
    } else {
      // Add vote
      votedList.push(id);
      localStorage.setItem('votedArtworks', JSON.stringify(votedList));
      
      // Optimistic UI Update (increase)
      setArtworks(prev => prev.map(art => 
        art.id === id ? { ...art, votes: art.votes + 1 } : art
      ));
      
      // Update Supabase
      await supabase
        .from('artworks')
        .update({ votes: currentArtwork.votes + 1 })
        .eq('id', id);
      
      return true; // voted
    }
  };

  const checkUserVoted = (id: string) => {
    const votedList = JSON.parse(localStorage.getItem('votedArtworks') || '[]');
    return votedList.includes(id);
  };

  const trackShare = async (id: string) => {
    // Track share count in Supabase (optional: create shares column)
    const currentArtwork = artworks.find(a => a.id === id);
    if (currentArtwork) {
      // Update local state
      setArtworks(prev => prev.map(art => 
        art.id === id ? { ...art, shares: (art.shares || 0) + 1 } : art
      ));
      
      // Update Supabase (if shares column exists)
      try {
        await supabase
          .from('artworks')
          .update({ shares: (currentArtwork.shares || 0) + 1 })
          .eq('id', id);
      } catch (error) {
        console.log('Share tracking: shares column may not exist yet');
      }
    }
  };

  return (
    <AppContext.Provider value={{ artworks, addArtwork, toggleVote, checkUserVoted, trackShare, isLoading }}>
      <Router>
        <AppContent />
      </Router>
    </AppContext.Provider>
  );
};

export default App;