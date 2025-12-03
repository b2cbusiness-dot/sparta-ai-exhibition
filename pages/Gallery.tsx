
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, PlayCircle, Star } from 'lucide-react';
import { useAppContext } from '../App';

const Gallery: React.FC = () => {
  const { artworks } = useAppContext();

  // Sort by votes descending (Popularity)
  const sortedArtworks = [...artworks].sort((a, b) => b.votes - a.votes);
  const topArtwork = sortedArtworks[0];
  const otherArtworks = sortedArtworks.slice(1);

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">제1회 시니어 AI 아트 전시회</h1>
          <p className="text-indigo-100 text-lg mb-6 leading-relaxed">
            AI를 처음 배운 분들의 놀라운 작품을 감상해보세요.<br/>
            투표에 참여하고 응원의 마음을 전해주세요.
          </p>
          <Link 
            to="/join" 
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold py-3 px-6 rounded-full shadow-md hover:bg-indigo-50 transition-colors"
          >
            <Star size={20} className="text-yellow-500 fill-current" />
            무료 수강 상담 신청하기
          </Link>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>

      {/* Featured Artwork (Most Voted) */}
      {topArtwork && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Heart className="text-yellow-600 w-5 h-5 fill-current" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">지금 가장 인기있는 작품</h2>
          </div>
          
          <Link to={`/artwork/${topArtwork.id}`} className="block group">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden md:flex hover:shadow-md transition-shadow">
              <div className="md:w-1/2 aspect-square md:aspect-video relative overflow-hidden bg-slate-900">
                {topArtwork.mediaType === 'video' ? (
                  <>
                    <video 
                      src={topArtwork.imageUrl} 
                      className="w-full h-full object-cover opacity-90"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="text-white/80 w-16 h-16" />
                    </div>
                  </>
                ) : (
                  <img 
                    src={topArtwork.imageUrl} 
                    alt={`${topArtwork.authorName} (${topArtwork.authorAgeGroup})`} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                
                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-sm shadow-sm flex items-center gap-1 z-10">
                  <Heart size={14} className="fill-current"/> 1위
                </div>
              </div>
              <div className="p-6 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {topArtwork.authorName} ({topArtwork.authorAgeGroup})
                </h3>
                {/* description 삭제됨 */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-slate-500 font-medium">{topArtwork.authorName} 작가님</span>
                  <span className="flex items-center gap-1 text-pink-500 font-bold">
                    <Heart size={18} className="fill-current" /> {topArtwork.votes}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid Gallery */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">전체 작품 둘러보기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArtworks.map(art => (
            <Link key={art.id} to={`/artwork/${art.id}`} className="group block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                 {art.mediaType === 'video' ? (
                  <>
                     <video 
                      src={art.imageUrl} 
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 text-white">
                      <PlayCircle size={16} />
                    </div>
                  </>
                ) : (
                  <img 
                    src={art.imageUrl} 
                    alt={`${art.authorName} (${art.authorAgeGroup})`} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-indigo-600">
                  {art.authorName} ({art.authorAgeGroup})
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{art.authorName}</span>
                  <span className="flex items-center gap-1 text-slate-400 group-hover:text-pink-500 transition-colors">
                    <Heart size={14} className="group-hover:fill-current" /> {art.votes}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Inline CTA for Leads */}
      <div className="bg-slate-100 rounded-xl p-8 text-center mt-12">
        <h3 className="text-xl font-bold text-slate-800 mb-2">나도 이런 그림을 그리고 싶다면?</h3>
        <p className="text-slate-600 mb-6">컴퓨터를 잘 몰라도 괜찮아요. 60대도 쉽게 배우는 AI 아트.</p>
        <Link to="/join" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors">
          무료 상담 신청하기
        </Link>
      </div>
    </div>
  );
};

export default Gallery;
