import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Trophy, User } from 'lucide-react';
import { Artwork, INITIAL_ARTWORKS } from './types';
import Gallery from './pages/Gallery';
import Submission from './pages/Submission';
import ArtworkDetail from './pages/ArtworkDetail';
import LeadGen from './pages/LeadGen';
import { supabase } from './services/supabaseClient';

// Global Context for Artworks
interface AppContextType {
  artworks: Artwork[];
  addArtwork: (artwork: Artwork) => void;
  voteArtwork: (id: string) => void;
  checkUserVoted: (id: string) => boolean;
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
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16 md:pb-0">
       {/* Mobile Header - Simple */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Sparta Gallery</span>
          </Link>
          <Link to="/join" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            강의 문의하기
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full p-4">
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/submit" element={<Submission />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/join" element={<LeadGen />} />
        </Routes>
      </main>

      {/* Mobile Bottom Nav - Simplified for Users */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Home size={24} />
            <span className="text-xs mt-1">갤러리</span>
          </Link>
          <Link to="/join" className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/join' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <User size={24} />
            <span className="text-xs mt-1">문의하기</span>
          </Link>
        </div>
      </nav>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-2">스파르타 AI 교육 전시회</p>
          <p className="text-sm">누구나 AI 아티스트가 될 수 있습니다.</p>
        </div>
      </footer>
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

  const voteArtwork = async (id: string) => {
    // 1. Optimistic UI Update
    setArtworks(prev => prev.map(art => 
      art.id === id ? { ...art, votes: art.votes + 1 } : art
    ));
    
    // 2. Save to local storage
    const votedList = JSON.parse(localStorage.getItem('votedArtworks') || '[]');
    if (!votedList.includes(id)) {
      votedList.push(id);
      localStorage.setItem('votedArtworks', JSON.stringify(votedList));
    }

    // 3. Update Supabase
    const currentArtwork = artworks.find(a => a.id === id);
    if (currentArtwork) {
      const { error } = await supabase
        .from('artworks')
        .update({ votes: currentArtwork.votes + 1 })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating vote:', error);
        // Revert on error if needed
      }
    }
  };

  const checkUserVoted = (id: string) => {
    const votedList = JSON.parse(localStorage.getItem('votedArtworks') || '[]');
    return votedList.includes(id);
  };

  return (
    <AppContext.Provider value={{ artworks, addArtwork, voteArtwork, checkUserVoted, isLoading }}>
      <Router>
        <AppContent />
      </Router>
    </AppContext.Provider>
  );
};

export default App;