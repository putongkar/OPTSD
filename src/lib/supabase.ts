import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 如果环境变量缺失，返回一个空客户端，避免应用崩溃
let supabaseClient: ReturnType<typeof createClient> | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('缺少 Supabase 环境变量，数据库功能不可用');
  console.warn('请联系管理员配置以下环境变量：');
  console.warn('VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient || (createClient('', '') as any);
