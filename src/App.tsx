import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from './components/ui/toaster';
import { AlertTriangle } from 'lucide-react';

// @ts-ignore - Vite 环境变量
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
// @ts-ignore - Vite 环境变量
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
const isConfigured = !!(supabaseUrl && supabaseAnonKey);

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            意见收集工具
          </h1>
          <p className="text-muted-foreground">
            收集各部门的小程序开发需求，高效管理开发任务
          </p>
        </div>

        {!isConfigured && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">环境配置缺失</h3>
                <p className="text-sm text-yellow-700">
                  数据库功能暂时不可用。请联系管理员配置环境变量：<br/>
                  <code className="bg-yellow-100 px-2 py-1 rounded text-xs font-mono">VITE_SUPABASE_URL</code> 和 <code className="bg-yellow-100 px-2 py-1 rounded text-xs font-mono">VITE_SUPABASE_ANON_KEY</code>
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="submit" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="submit">提交需求</TabsTrigger>
            <TabsTrigger value="admin">需求汇总</TabsTrigger>
          </TabsList>
          <TabsContent value="submit" className="mt-6">
            <FeedbackForm />
          </TabsContent>
          <TabsContent value="admin" className="mt-6">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
