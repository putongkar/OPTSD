import * as XLSX from 'xlsx';
import { FeedbackRequest } from '../types';

export const exportToExcel = (requests: FeedbackRequest[]) => {
  // 创建工作表数据
  const data = requests.map((request, index) => ({
    '序号': index + 1,
    '部门名称': request.department,
    '联系人': request.contactName,
    '联系电话': request.contactPhone || '',
    '联系邮箱': request.contactEmail || '',
    '优先级': request.priority === 'high' ? '高' : request.priority === 'medium' ? '中' : '低',
    '期望完成时间': request.expectedCompletion || '',
    '需要解决的问题': request.problemDescription,
    '程序要求': request.requirements,
    '补充说明': request.additionalNotes || '',
    '提交时间': new Date(request.createdAt).toLocaleString('zh-CN'),
  }));

  // 创建工作簿
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '需求汇总');

  // 设置列宽
  const colWidths = [
    { wch: 6 },   // 序号
    { wch: 15 },  // 部门名称
    { wch: 12 },  // 联系人
    { wch: 15 },  // 联系电话
    { wch: 25 },  // 联系邮箱
    { wch: 8 },   // 优先级
    { wch: 15 },  // 期望完成时间
    { wch: 50 },  // 需要解决的问题
    { wch: 50 },  // 程序要求
    { wch: 30 },  // 补充说明
    { wch: 22 },  // 提交时间
  ];
  ws['!cols'] = colWidths;

  // 生成文件名（带时间戳）
  const now = new Date();
  const fileName = `需求汇总_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.xlsx`;

  // 下载文件
  XLSX.writeFile(wb, fileName);
};
