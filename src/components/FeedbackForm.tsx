import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { storage } from '../utils/storage';
import { useToast } from './ui/use-toast';

export default function FeedbackForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    department: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    problemDescription: '',
    requirements: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    expectedCompletion: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.department || !formData.contactName || !formData.problemDescription) {
      toast({
        title: '提示',
        description: '请填写必填项（部门名称、联系人、问题描述）',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await storage.add(formData);
      toast({
        title: '提交成功',
        description: '您的需求已成功提交！',
      });

      setFormData({
        department: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        problemDescription: '',
        requirements: '',
        priority: 'medium',
        expectedCompletion: '',
        additionalNotes: ''
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: '提交失败',
        description: '提交失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">小程序开发需求提交</CardTitle>
        <CardDescription>
          请填写您部门的小程序开发需求，我们将根据需求优先级进行开发排期
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">部门名称 *</Label>
              <Input
                id="department"
                placeholder="请输入部门名称"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">联系人 *</Label>
              <Input
                id="contactName"
                placeholder="请输入联系人姓名"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">联系电话</Label>
              <Input
                id="contactPhone"
                placeholder="请输入联系电话"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">联系邮箱</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="请输入联系邮箱"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemDescription">工作中需要用程序解决的问题 *</Label>
            <Textarea
              id="problemDescription"
              placeholder="请详细描述您在工作中遇到的需要通过程序解决的问题"
              value={formData.problemDescription}
              onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">对程序的要求和期望 *</Label>
            <Textarea
              id="requirements"
              placeholder="请描述您希望程序具备哪些功能、界面要求、使用场景等"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">优先级</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedCompletion">期望完成时间</Label>
              <Input
                id="expectedCompletion"
                type="date"
                value={formData.expectedCompletion}
                onChange={(e) => setFormData({ ...formData, expectedCompletion: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">其他补充说明</Label>
            <Textarea
              id="additionalNotes"
              placeholder="其他需要说明的内容（选填）"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '提交需求'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
