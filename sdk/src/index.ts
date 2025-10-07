export type TaskType = "free" | "ddl";

export interface TaskDTO {
  id: string;
  uid: string;
  title: string;
  type: TaskType;
  due?: string | null;
  substeps: string[];
  status: "open" | "done" | "deferred";
  createdAt: string;
}

export interface FocusSessionDTO {
  id: string;
  uid: string;
  mode: 25 | 45 | 60;
  start: string;
  end?: string | null;
  interrupts: number;
  notes?: string | null;
}

export interface IdeaDTO {
  id: string;
  uid: string;
  text?: string;
  audioRef?: string;
  context?: string;
  createdAt: string;
  status: "inbox" | "archived" | "converted";
}

export interface SleepSessionDTO {
  id: string;
  uid: string;
  soundscape: string;
  duration: number;
  endedBy?: string | null;
}

export interface RewardDTO {
  id: string;
  uid: string;
  type: "focus" | "steps" | "sleep";
  points: number;
  createdAt: string;
}


