import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, CheckCircle2 } from 'lucide-react';

const LeadGen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    agreed: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.agreed) {
      setIsSubmitted(true);
      // In a real app, send data to backend/CRM
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-lg mx-auto mt-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">신청이 완료되었습니다!</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          스파르타 교육 매니저가 곧 연락드려<br/>
          친절하게 안내해 드리겠습니다.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
        >
          다른 작품 더 구경하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
      
      {/* Left Column: Persuasion */}
      <div className="bg-sparta-red text-white rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-sm font-bold text-red-200 uppercase tracking-wider mb-2">스파르타 AI 교육</h2>
          <h1 className="text-3xl font-bold mb-6 leading-tight">
            "나이가 들어도 <br/>
            배움에는 늦음이 없습니다"
          </h1>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl font-bold shrink-0">1</div>
              <div>
                <h3 className="font-bold text-lg mb-1">왕초보 맞춤 교육</h3>
                <p className="text-red-100 text-sm">마우스를 잡는 법부터 차근차근, 눈높이에 맞춰 설명해드립니다.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl font-bold shrink-0">2</div>
              <div>
                <h3 className="font-bold text-lg mb-1">나만의 작품 만들기</h3>
                <p className="text-red-100 text-sm">손주에게 줄 동화책, 추억이 담긴 그림 등 진짜 결과물을 만듭니다.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl font-bold shrink-0">3</div>
              <div>
                <h3 className="font-bold text-lg mb-1">든든한 동료들</h3>
                <p className="text-red-100 text-sm">비슷한 연령대의 동료들과 함께 즐겁게 배우고 소통하세요.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Right Column: Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">무료 상담 신청</h2>
        <p className="text-slate-500 mb-8">연락처를 남겨주시면 교육 과정을 안내해드립니다.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">성함</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="홍길동" 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-sparta-red focus:ring-1 focus:ring-sparta-red outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">연락처</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="010-1234-5678" 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-sparta-red focus:ring-1 focus:ring-sparta-red outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <input 
              type="checkbox" 
              id="privacy"
              checked={formData.agreed}
              onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
              className="mt-1 w-4 h-4 text-sparta-red rounded border-slate-300 focus:ring-sparta-red accent-sparta-red"
              required
            />
            <label htmlFor="privacy" className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">개인정보 수집 및 이용 동의</span><br/>
              상담 진행을 위해 이름, 연락처를 수집하며 상담 완료 후 파기합니다.
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-sparta-red hover:bg-sparta-red-dark text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            무료 상담 신청하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadGen;