import {
  CheckCircle2,
  CircleUserRound,
  FolderKanban,
  ListPlus,
  Pencil,
  RefreshCw,
  Trash2,
  UserMinus,
  UserPlus,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type ActivityVisual = {
  label: string;
  icon: LucideIcon;
  className: string;
};

const defaultActivityVisual: ActivityVisual = {
  label: "Workspace activity",
  icon: RefreshCw,
  className:
    "border-slate-500/20 bg-slate-500/10 text-slate-400",
};

const activityVisuals: Record<string, ActivityVisual> = {
  PROJECT_CREATED: {
    label: "Project created",
    icon: FolderKanban,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  PROJECT_UPDATED: {
    label: "Project updated",
    icon: Pencil,
    className:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },

  PROJECT_COMPLETED: {
    label: "Project completed",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  TASK_CREATED: {
    label: "Task created",
    icon: ListPlus,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  TASK_UPDATED: {
    label: "Task updated",
    icon: Pencil,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  TASK_STATUS_CHANGED: {
    label: "Task status changed",
    icon: RefreshCw,
    className:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  },

  TASK_COMPLETED: {
    label: "Task completed",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  TASK_DELETED: {
    label: "Task deleted",
    icon: Trash2,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  MEMBER_ADDED: {
    label: "Member added",
    icon: UserPlus,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  MEMBER_REMOVED: {
    label: "Member removed",
    icon: UserMinus,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  MEMBER_ROLE_UPDATED: {
    label: "Member role updated",
    icon: UsersRound,
    className:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },

  COMMENT_ADDED: {
    label: "Comment added",
    icon: CircleUserRound,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },
};

export function getActivityVisual(
  type: string,
): ActivityVisual {
  return activityVisuals[type] ?? defaultActivityVisual;
}