import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../App';
import confetti from 'canvas-confetti';

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { artworks, voteArtwork } = useAppContext();
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const artwork = artworks.find(a => a.id === id);

  if (!artwork) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">작품을 찾을 수 없습니다.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 underline">홈으로 돌아가기</button>
      </div>
    );
  }

  const handleVote = () => {
    if (hasVoted) return;
    
    voteArtwork(artwork.id);
    setHasVoted(true);
    
    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#F59E0B', '#3B82F6']
    });
  };

  const handleShare = () => {
    // Mock sharing logic
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className="pb-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-6 px-2"
      >
        <ArrowLeft size={20} />
        전체 갤러리로 돌아가기
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {/* Media Display (Image or Video) */}
        <div className="w-full bg-black relative flex items-center justify-center">
          {artwork.mediaType === 'video' ? (
             <video 
              src={artwork.imageUrl} 
              controls 
              autoPlay
              className="w-full max-h-[600px] object-contain mx-auto"
            />
          ) : (
            <img 
              src={artwork.imageUrl} 
              alt={artwork.authorName} 
              className="w-full max-h-[600px] object-contain mx-auto"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {artwork.authorName} ({artwork.authorAgeGroup})
              </h1>
              <p className="text-lg text-slate-600 font-medium">by. {artwork.authorName} 작가님</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleShare}
                className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Share2 size={24} />
                <span className="text-xs mt-1 font-medium">공유</span>
              </button>
            </div>
          </div>

          {/* description 섹션 삭제 */}

          {/* Action Section */}
          <div className="border-t border-slate-100 pt-8 flex flex-col items-center gap-6">
            
            <button
              onClick={handleVote}
              disabled={hasVoted}
              className={`
                group relative w-full max-w-md py-4 rounded-full text-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
                ${hasVoted 
                  ? 'bg-pink-50 text-pink-500 cursor-default ring-2 ring-pink-100' 
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-pink-200 hover:shadow-xl'}
              `}
            >
              <Heart 
                size={28} 
                className={`transition-transform duration-300 ${hasVoted ? 'fill-current scale-110' : 'group-hover:scale-125'}`} 
              />
              {hasVoted ? `투표 완료! (${artwork.votes})` : `이 작품에 투표하기 (${artwork.votes})`}
            </button>

            {hasVoted && (
              <div className="text-center animate-fade-in">
                <p className="text-slate-600 mb-4">투표해 주셔서 감사합니다!</p>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 max-w-lg mx-auto">
                  <h4 className="text-lg font-bold text-indigo-900 mb-2">
                    "{artwork.authorName}"님처럼 멋진 작품을 만들어보고 싶나요?
                  </h4>
                  <p className="text-indigo-700 mb-4 text-sm">
                    컴퓨터를 몰라도 괜찮아요. 60대 수강생도 3주 만에 작가가 되었습니다.
                  </p>
                  <Link 
                    to="/join"
                    className="block w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    나도 배워보기 (무료 상담)
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50 animate-fade-in-up">
          <CheckCircle2 size={20} className="text-green-400" />
          <span>링크가 복사되었습니다! 친구들에게 공유해보세요.</span>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;