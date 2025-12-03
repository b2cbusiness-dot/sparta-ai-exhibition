import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, FileUp } from 'lucide-react';
import { useAppContext } from '../App';
import { Artwork } from '../types';
import { supabase } from '../services/supabaseClient';

const Submission: React.FC = () => {
  const navigate = useNavigate();
  const { addArtwork } = useAppContext();
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  const [authorName, setAuthorName] = useState('');
  const [authorAgeGroup, setAuthorAgeGroup] = useState('');  // 새로 추가
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setMediaType(selectedFile.type.startsWith('video/') ? 'video' : 'image');

      // Auto-fill from filename if matches pattern "Name_Age_..."
      const fileName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
      const parts = fileName.split('_');
      
      if (parts.length >= 2) {
        setAuthorName(parts[0]);
        setAuthorAgeGroup(parts[1]);  // 예: '60대'
      }
    }
  };

  // AI Help 함수 삭제 (description이 없으므로 불필요)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !authorName || !authorAgeGroup) return;

    setIsSubmitting(true);
    
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-media')
        .getPublicUrl(filePath);

      // 3. Insert into Database
      const { data: insertData, error: insertError } = await supabase
        .from('artworks')
        .insert([
          {
            author_name: authorName,
            author_age_group: authorAgeGroup,
            media_type: mediaType,
            image_url: publicUrl,
            votes: 0
          }
        ])
        .select();

      if (insertError) throw insertError;

      if (insertData && insertData.length > 0) {
        const newArtwork: Artwork = {
          id: insertData[0].id,
          imageUrl: insertData[0].image_url,
          mediaType: insertData[0].media_type,
          authorName: insertData[0].author_name,
          authorAgeGroup: insertData[0].author_age_group,
          votes: insertData[0].votes,
          timestamp: new Date(insertData[0].created_at).getTime()
        };
        
        addArtwork(newArtwork);
        navigate(`/artwork/${newArtwork.id}`);
      }

    } catch (error: any) {
      console.error('Error submitting artwork:', error);
      alert(`업로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    alert("현재 Supabase 연동 버전에서는 CSV 일괄 업로드가 제한됩니다. 한 건씩 등록해주세요.");
    // Supabase DB insert 로직으로 변경 필요 (복잡도 증가로 인해 현재는 비활성화 메시지 처리)
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">관리자용 작품 등록</h1>
        <p className="text-slate-500 mb-8">
          파일명 규칙: <span className="font-mono bg-slate-100 px-1 rounded">이름_연령대.확장자</span> (예: 김철수_60대.jpg)
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">작품 파일 (이미지/영상)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden
                ${previewUrl ? 'border-indigo-200 bg-black' : 'border-slate-300 hover:bg-slate-50 hover:border-indigo-400'}
              `}
            >
              {previewUrl ? (
                mediaType === 'video' ? (
                  <video src={previewUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                )
              ) : (
                <div className="text-center p-4">
                  <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="text-indigo-600" size={28} />
                  </div>
                  <p className="font-bold text-slate-700">파일 선택</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
                className="hidden" 
                required
              />
            </div>
          </div>

          {/* AI Help 섹션 삭제 */}

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">작가명</label>
                <input 
                  type="text" 
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">연령대</label>
                <select
                  value={authorAgeGroup}
                  onChange={(e) => setAuthorAgeGroup(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="40대">40대</option>
                  <option value="50대">50대</option>
                  <option value="60대">60대</option>
                  <option value="70대 이상">70대 이상</option>
                </select>
              </div>
            </div>

            {/* description textarea 삭제 */}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : '작품 등록하기'}
          </button>
        </form>
      </div>

      <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 text-center opacity-50">
        <h3 className="text-slate-700 font-bold mb-2">CSV 일괄 업로드</h3>
        <button 
          type="button"
          onClick={() => csvInputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors cursor-not-allowed"
          disabled
        >
          <FileUp size={18} />
          CSV 파일 선택 (준비중)
        </button>
        <input 
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Submission;