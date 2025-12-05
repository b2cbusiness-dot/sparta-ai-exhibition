import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { useAppContext } from '../App';
import confetti from 'canvas-confetti';

const COURSE_URL = 'https://bit.ly/48PviDn';

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { artworks, toggleVote, checkUserVoted, trackShare } = useAppContext();
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);

  const artwork = artworks.find(a => a.id === id);

  // 페이지 로드 시 투표 상태 확인
  useEffect(() => {
    if (id) {
      setHasVoted(checkUserVoted(id));
    }
  }, [id, checkUserVoted]);

  if (!artwork) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">작품을 찾을 수 없습니다.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-sparta-red underline">홈으로 돌아가기</button>
      </div>
    );
  }

  const handleVote = async () => {
    const isNowVoted = await toggleVote(artwork.id);
    setHasVoted(isNowVoted);
    
    if (isNowVoted) {
      setShowVoteModal(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FB0231', '#FF4D6A', '#FFD700']
      });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
    trackShare(artwork.id);
  };

  return (
    <div className="pb-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-6 px-2"
      >
        <ArrowLeft size={20} />
        전체 갤러리로 돌아가기
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
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

        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {artwork.authorName} 작가님 ({artwork.authorAgeGroup})
              </h1>
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

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 mb-8 border border-red-100">
            <p className="text-slate-700 leading-relaxed">
              ✨ <span className="font-bold text-sparta-red">{artwork.authorName}</span> 작가님은 
              <span className="font-bold"> 스파르타클럽 AI 교육</span>을 듣고 
              {artwork.mediaType === 'video' ? ' 단 몇 분만에 이런 멋진 영상' : ' 단 몇 분만에 이런 멋진 작품'}을 
              만들 수 있게 되었습니다!
            </p>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col items-center gap-6">
            <button
              onClick={handleVote}
              className={`
                group relative w-full max-w-md py-4 rounded-full text-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
                ${hasVoted 
                  ? 'bg-red-50 text-sparta-red ring-2 ring-red-100 hover:bg-red-100' 
                  : 'bg-gradient-to-r from-sparta-red to-sparta-red-light text-white hover:shadow-red-200 hover:shadow-xl'}
              `}
            >
              <Heart 
                size={28} 
                className={`transition-transform duration-300 ${hasVoted ? 'fill-current scale-110' : 'group-hover:scale-125'}`} 
              />
              {hasVoted ? `투표 완료! (${artwork.votes})` : `이 작품에 투표하기 (${artwork.votes})`}
            </button>

            {hasVoted && (
              <p className="text-sparta-red font-medium animate-pulse">
                ❤️ 투표해 주셔서 감사합니다!
              </p>
            )}
          </div>
        </div>
      </div>

      {showShareToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50 animate-fade-in-up">
          <CheckCircle2 size={20} className="text-green-400" />
          <span>링크가 복사되었습니다! 친구들에게 공유해보세요.</span>
        </div>
      )}

      {showVoteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowVoteModal(false)}>
          <div 
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-sparta-red to-sparta-red-light p-6 text-center text-white">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-sparta-red fill-current" />
              </div>
              <h2 className="text-2xl font-bold mb-1">투표 완료! 🎉</h2>
              <p className="text-red-100">응원해 주셔서 감사합니다</p>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 rounded-xl overflow-hidden mb-4">
                <img 
                  src="/course-thumbnail.png" 
                  alt="AI 영상·이미지 제작 왕초보 클래스"
                  className="w-full object-contain"
                />
                <div className="p-4">
                  <p className="text-xs text-slate-500 mb-1">이 작가님이 수강하신 강의</p>
                  <h3 className="font-bold text-slate-900">AI 영상·이미지 제작 왕초보 클래스</h3>
                  <p className="text-sm text-sparta-red font-medium">ChatGPT / SORA / SNS 마케팅</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-slate-700 mb-2">
                  <span className="font-bold">{artwork.authorName}</span> 작가님처럼
                </p>
                <p className="text-lg font-bold text-slate-900 mb-3">
                  나도 멋진 AI 작품을 만들어볼까요?
                </p>
                <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 국비지원 90% 할인 + 평생소장!
                </div>
              </div>

              <a 
                href={COURSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-sparta-red text-white font-bold py-4 rounded-xl text-center hover:bg-sparta-red-dark transition-colors text-lg"
                onClick={() => setShowVoteModal(false)}
              >
                강의 자세히 보기
                <ExternalLink size={20} />
              </a>
              
              <button 
                onClick={() => setShowVoteModal(false)}
                className="w-full text-slate-400 text-sm mt-3 py-2 hover:text-slate-600"
              >
                다른 작품 더 구경하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;