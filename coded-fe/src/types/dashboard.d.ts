export interface DashboardStats {
  total_activities: number;
  completed_activities: number;
  pending_activities: number;
  average_score: number;
}

export interface DashboardActivity {
  id: number;
  title: string;
  description: string;
  due_date: string;
  max_score: string;
  status: string;
  teacher_name: string;
  class_name: string;
  is_expired: boolean;
  created_at: string;
}

export interface DashboardSubmission {
  id: number;
  activity: {
    id: number;
    title: string;
    max_score: string;
  };
  content: string;
  score: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardClassInfo {
  name: string;
  teacher: string;
}

export interface StudentDashboardData {
  stats: DashboardStats;
  activities_today: DashboardActivity[];
  upcoming_activities: DashboardActivity[];
  recent_submissions: DashboardSubmission[];
  class_info: DashboardClassInfo;
}
