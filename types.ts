export interface Artwork {
  id: string;
  imageUrl: string; // Used for both image URL and Video URL
  mediaType: 'image' | 'video';
  authorName: string;
  authorAgeGroup: string; // 연령대 (예: '40대', '50대', '60대')
  votes: number;
  timestamp: number;
}

// title은 프론트엔드에서 조합: `${authorName} (${authorAgeGroup})`

export interface LeadInfo {
  name: string;
  phone: string;
  interestLevel: string;
}

// 초기 데이터는 이제 빈 배열로 시작하고, Supabase에서 불러옵니다.
export const INITIAL_ARTWORKS: Artwork[] = [];