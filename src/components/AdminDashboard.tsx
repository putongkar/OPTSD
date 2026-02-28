import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { storage } from '../utils/storage';
import { FeedbackRequest } from '../types';
import { useToast } from './ui/use-toast';
import { Trash2, Clock, User, AlertTriangle, Shield, ShieldCheck, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { exportToExcel } from '../utils/exportExcel';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<FeedbackRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 检查是否是主机（localhost或本机访问）
  const isHost = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' ||
                 window.location.hostname === '0.0.0.0';

  useEffect(() => {
    loadRequests();
    // 从 localStorage 读取管理员状态
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await storage.getAll();
      setRequests(data);
    } catch (error) {
      console.error('Load requests error:', error);
      toast({
        title: '加载失败',
        description: '加载数据失败，请刷新页面重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    // 简单的管理员密码：admin123
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowLogin(false);
      toast({
        title: '登录成功',
        description: '已切换到管理员模式',
      });
    } else {
      toast({
        title: '密码错误',
        description: '管理员密码错误',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    toast({
      title: '已退出',
      description: '已退出管理员模式',
    });
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin && !isHost) {
      toast({
        title: '权限不足',
        description: '只有管理员才能删除需求',
        variant: 'destructive'
      });
      return;
    }
    if (confirm('确定要删除这条需求记录吗？此操作不可恢复。')) {
      try {
        await storage.delete(id);
        await loadRequests();
        toast({
          title: '删除成功',
          description: '需求记录已删除',
        });
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: '删除失败',
          description: '删除失败，请稍后重试',
          variant: 'destructive'
        });
      }
    }
  };

  const handleClearAll = async () => {
    if (!isAdmin && !isHost) {
      toast({
        title: '权限不足',
        description: '只有管理员才能清空所有记录',
        variant: 'destructive'
      });
      return;
    }
    if (confirm('确定要清空所有需求记录吗？此操作不可恢复。')) {
      try {
        await storage.clear();
        await loadRequests();
        toast({
          title: '清空成功',
          description: '所有需求记录已清空',
        });
      } catch (error) {
        console.error('Clear error:', error);
        toast({
          title: '清空失败',
          description: '清空失败，请稍后重试',
          variant: 'destructive'
        });
      }
    }
  };

  const handleExport = () => {
    try {
      exportToExcel(requests);
      toast({
        title: '导出成功',
        description: '需求汇总已导出为Excel文件',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: '导出失败',
        description: '导出失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '未设置';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (e) {
      return dateString;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.priority === filter);

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const canEdit = isAdmin || isHost;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">需求汇总</CardTitle>
                {canEdit ? (
                  <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <ShieldCheck className="h-4 w-4" />
                    管理员模式
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground px-2 py-1 rounded-full border">
                    <User className="h-4 w-4" />
                    只读模式
                  </span>
                )}
              </div>
              <CardDescription>
                查看各部门提交的小程序开发需求
              </CardDescription>
            </div>
            <div className="flex gap-2 items-start">
              {!isHost && (
                <>
                  {isAdmin ? (
                    <Button variant="outline" onClick={handleLogout}>
                      退出管理
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setShowLogin(true)}>
                      <Shield className="h-4 w-4 mr-2" />
                      管理员登录
                    </Button>
                  )}
                </>
              )}
              <Button onClick={handleExport} disabled={requests.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                导出Excel
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end mt-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              全部 ({requests.length})
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              onClick={() => setFilter('high')}
            >
              高优先级
            </Button>
            <Button
              variant={filter === 'medium' ? 'default' : 'outline'}
              onClick={() => setFilter('medium')}
            >
              中优先级
            </Button>
            <Button
              variant={filter === 'low' ? 'default' : 'outline'}
              onClick={() => setFilter('low')}
            >
              低优先级
            </Button>
          </div>
        </CardHeader>
      </Card>

      {showLogin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">管理员登录</CardTitle>
            <CardDescription>输入管理员密码以获得删除权限</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">管理员密码</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="请输入管理员密码"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLogin}>登录</Button>
              <Button variant="outline" onClick={() => setShowLogin(false)}>取消</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            加载中...
          </CardContent>
        </Card>
      ) : sortedRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            暂无需求记录
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sortedRequests.map((request) => (
            <Card key={request.id} className="border">
              <CardHeader className="py-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleExpand(request.id)}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {getPriorityLabel(request.priority)}
                    </span>
                    <span className="font-semibold text-base flex-1">{request.department}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{request.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(request.createdAt)}</span>
                    </div>
                    {expandedId === request.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  {canEdit && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(request.id);
                      }}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              {expandedId === request.id && (
                <CardContent className="pt-0 pb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {request.contactPhone && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
                        <span className="text-lg">📞</span>
                        <span className="font-medium">电话：</span>
                        <span className="text-gray-700">{request.contactPhone}</span>
                      </div>
                    )}
                    {request.contactEmail && (
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded border">
                        <span className="text-lg">✉️</span>
                        <span className="font-medium">邮箱：</span>
                        <span className="text-gray-700 text-xs break-all">{request.contactEmail}</span>
                      </div>
                    )}
                    {request.expectedCompletion && (
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">期望完成：</span>
                        <span className="text-gray-700">{request.expectedCompletion}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      需要解决的问题
                    </h4>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap bg-red-50 p-3 rounded border">
                      {request.problemDescription}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-700">程序要求</h4>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap bg-blue-50 p-3 rounded border">
                      {request.requirements}
                    </div>
                  </div>
                  {request.additionalNotes && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-700">补充说明</h4>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap bg-green-50 p-3 rounded border">
                        {request.additionalNotes}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {canEdit && requests.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <Button variant="destructive" onClick={handleClearAll} className="w-full">
              清空所有记录
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
