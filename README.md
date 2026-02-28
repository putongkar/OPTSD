# 意见收集工具

一个用于收集各部门小程序开发需求的Web应用，使用 Supabase 云数据库存储。

## 功能特点

- 部门提交需求表单
- 管理员查看汇总信息
- 按优先级筛选需求
- 云端数据存储，支持多部门协同
- 实时数据同步

## 技术栈

- React 18 + TypeScript
- Vite
- TailwindCSS
- shadcn/ui 组件库
- Supabase 云数据库

## 快速开始

### 安装依赖

```bash
npm install
```

### 环境配置

项目已配置 Supabase 云数据库，环境变量在 `.env` 文件中。

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

### 提交需求

1. 在"提交需求"标签页填写表单
2. 必填项：部门名称、联系人、问题描述、程序要求
3. 可选：联系电话、邮箱、优先级、期望完成时间、补充说明
4. 点击"提交需求"按钮提交

### 查看汇总

1. 切换到"需求汇总"标签页
2. 可按优先级筛选查看
3. 可删除单个需求
4. 可清空所有记录

## 数据存储

数据存储在 Supabase 云数据库中，支持：
- 多部门同时提交需求
- 实时数据同步
- 数据持久化存储
- 可扩展的后端功能

## 数据库表结构

### feedback_requests

| 字段 | 类型 | 说明 |
|------|------|------|
| id | text | 主键 |
| department | text | 部门名称 |
| contact_name | text | 联系人 |
| contact_phone | text | 联系电话 |
| contact_email | text | 联系邮箱 |
| problem_description | text | 问题描述 |
| requirements | text | 程序要求 |
| priority | text | 优先级（low/medium/high） |
| expected_completion | text | 期望完成时间 |
| additional_notes | text | 补充说明 |
| created_at | timestamp | 创建时间 |

## 部署说明

部署时需要配置以下环境变量：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 后续扩展

- 添加用户认证
- 实现需求状态跟踪
- 添加通知功能
- 数据导出功能
