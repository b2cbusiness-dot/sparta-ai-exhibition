
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, PlayCircle, Star, Search, X, ExternalLink } from 'lucide-react';
import { useAppContext } from '../App';

const COURSE_URL = 'https://bit.ly/48PviDn';

const Gallery: React.FC = () => {
  const { artworks } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링 + 투표순 정렬 (유니코드 정규화 적용)
  const filteredArtworks = artworks.filter(art => {
    const authorName = (art.authorName || '').normalize('NFC');
    const query = searchQuery.normalize('NFC');
    return authorName.toLowerCase().includes(query.toLowerCase());
  });
  
  const sortedArtworks = [...filteredArtworks].sort((a, b) => b.votes - a.votes);
  const topArtwork = searchQuery ? null : sortedArtworks[0]; // 검색 중에는 1위 섹션 숨김
  const displayArtworks = searchQuery ? sortedArtworks : sortedArtworks.slice(1);

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sparta-red to-sparta-red-light rounded-2xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">제1회 AI 아트 전시회</h1>
          <p className="text-red-100 text-lg mb-6 leading-relaxed">
            AI를 처음 배운 분들의 놀라운 작품을 감상해보세요.<br/>
            투표에 참여하고 응원의 마음을 전해주세요.
          </p>
          <a 
            href={COURSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sparta-red font-bold py-3 px-6 rounded-full shadow-md hover:bg-red-50 transition-colors"
          >
            <Star size={20} className="text-yellow-500 fill-current" />
            나도 AI 아트 배우기
            <ExternalLink size={16} />
          </a>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>

      {/* 🔍 검색 바 추가 */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <Search className="text-slate-400 ml-4" size={20} />
          <input
            type="text"
            placeholder="작가 이름으로 검색 (예: 김르탄)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 outline-none text-slate-700 placeholder-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="mr-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-slate-500 mt-2">
            "{searchQuery}" 검색 결과: {sortedArtworks.length}개 작품
          </p>
        )}
      </div>

      {/* Featured Artwork - 검색 중에는 숨김 */}
      {topArtwork && !searchQuery && (
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
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-sparta-red transition-colors">
                  {topArtwork.authorName} 작가님 ({topArtwork.authorAgeGroup})
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  🏆 현재 <span className="text-sparta-red font-bold">1위</span> 작품이에요!<br/>
                  좋아요를 눌러 이 작가님을 응원해주세요!
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-slate-500">클릭해서 자세히 보기 →</span>
                  <span className="flex items-center gap-1 text-sparta-red font-bold text-lg">
                    <Heart size={20} className="fill-current" /> {topArtwork.votes}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid Gallery */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {searchQuery ? `"${searchQuery}" 검색 결과` : '전체 작품 둘러보기'}
        </h2>
        
        {displayArtworks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>"{searchQuery}"에 해당하는 작품이 없습니다.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sparta-red underline"
            >
              전체 작품 보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {displayArtworks.map((art, index) => (
              <Link key={art.id} to={`/artwork/${art.id}`} className="group block bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                   {art.mediaType === 'video' ? (
                    <>
                       <video 
                        src={art.imageUrl} 
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                      <div className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 text-white">
                        <PlayCircle size={12} />
                      </div>
                    </>
                  ) : (
                    <img 
                      src={art.imageUrl} 
                      alt={`${art.authorName} (${art.authorAgeGroup})`} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* 순위 뱃지 (상위 3개) */}
                  {index < 3 && (
                    <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-yellow-900 font-bold w-6 h-6 rounded-full text-xs flex items-center justify-center shadow">
                      {index + 2}
                    </div>
                  )}
                </div>
                <div className="p-2 md:p-3">
                  <h3 className="text-sm md:text-base font-bold text-slate-900 truncate group-hover:text-sparta-red">
                    {art.authorName} 작가님 ({art.authorAgeGroup})
                  </h3>
                  <div className="flex items-center justify-end text-xs md:text-sm mt-1">
                    <span className="flex items-center gap-1 text-slate-400 group-hover:text-sparta-red transition-colors">
                      <Heart size={12} className="group-hover:fill-current" /> {art.votes}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      
      {/* Inline CTA */}
      <div className="bg-red-50 rounded-xl p-8 text-center mt-12">
        <h3 className="text-xl font-bold text-slate-800 mb-2">나도 이런 작품을 만들고 싶다면?</h3>
        <p className="text-slate-600 mb-6">컴퓨터를 잘 몰라도 괜찮아요.<br/>누구나 쉽게 배우는 AI 아트 제작법을 국비지원으로 배워보세요!</p>
        <a 
          href={COURSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-sparta-red text-white font-bold py-3 px-8 rounded-lg hover:bg-sparta-red-dark transition-colors"
        >
          강의 자세히 보기
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
};

export default Gallery;
