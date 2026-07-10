export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface NavigationItem {
  label: string;
  href: string;
}

export interface DashboardStat {
  title: string;
  value: number;
  change: number;
  description: string;
}