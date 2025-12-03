import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정 값을 가져옵니다.
// .env 파일이 없는 경우, 아래 변수에 직접 Supabase URL과 Anon Key를 문자열로 입력해주세요.
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-anon-key';

if (supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('Supabase URL이 설정되지 않았습니다. services/supabaseClient.ts 파일에 본인의 Supabase URL과 Key를 입력해주세요.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);