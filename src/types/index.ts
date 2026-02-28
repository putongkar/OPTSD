export interface FeedbackRequest {
  id: string;
  department: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  problemDescription: string;
  requirements: string;
  priority: 'low' | 'medium' | 'high';
  expectedCompletion: string;
  additionalNotes: string;
  createdAt: string;
}
