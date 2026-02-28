import { supabase } from '../lib/supabase';
import { FeedbackRequest } from '../types';

export const storage = {
  getAll: async (): Promise<FeedbackRequest[]> => {
    const { data, error } = await supabase
      .from('feedback_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching requests:', error);
      return [];
    }
    
    // 将数据库的蛇形命名转换为代码的驼峰命名
    return (data || []).map((item: any): FeedbackRequest => ({
      id: item.id,
      department: item.department,
      contactName: item.contact_name,
      contactPhone: item.contact_phone,
      contactEmail: item.contact_email,
      problemDescription: item.problem_description,
      requirements: item.requirements,
      priority: item.priority,
      expectedCompletion: item.expected_completion,
      additionalNotes: item.additional_notes,
      createdAt: item.created_at,
    }));
  },

  add: async (request: Omit<FeedbackRequest, 'id' | 'createdAt'>): Promise<FeedbackRequest> => {
    const { data, error } = await supabase
      .from('feedback_requests')
      .insert([
        {
          department: request.department,
          contact_name: request.contactName,
          contact_phone: request.contactPhone,
          contact_email: request.contactEmail,
          problem_description: request.problemDescription,
          requirements: request.requirements,
          priority: request.priority,
          expected_completion: request.expectedCompletion,
          additional_notes: request.additionalNotes,
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding request:', error);
      throw error;
    }
    
    return {
      id: data.id,
      department: data.department,
      contactName: data.contact_name,
      contactPhone: data.contact_phone,
      contactEmail: data.contact_email,
      problemDescription: data.problem_description,
      requirements: data.requirements,
      priority: data.priority,
      expectedCompletion: data.expected_completion,
      additionalNotes: data.additional_notes,
      createdAt: data.created_at,
    };
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('feedback_requests')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  },

  clear: async (): Promise<void> => {
    const { error } = await supabase
      .from('feedback_requests')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (error) {
      console.error('Error clearing requests:', error);
      throw error;
    }
  }
};
