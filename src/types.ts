export type ViewState = 'dashboard' | 'playback' | 'history' | 'skills' | 'settings' | 'devices' | 'devices_empty';
export type SuperAppTab = 'home' | 'workbench' | 'smart_scene' | 'mine';
export type AppScreen = 'super_app' | 'badge_app' | 'page_flow';

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'insight' | 'skill_recommendation' | 'alert';
  actionLabel?: string;
}

export interface SOPStepItem {
  id: string;
  stepNo: number;
  title: string;
  sopStandard: string;
  aiEvidence: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  confidence?: number;
  timeRange?: string;
  seekSeconds?: number;
  snapshotUrl?: string;
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeLabel: string;
  type: 'audio' | 'video' | 'context';
  summary: string;
  detail?: string;
  tags?: string[];
  imageUrl?: string;
  audioDuration?: string;
  sopId?: string;
  sopName?: string;
  sopScore?: number;
  sopOverallStatus?: 'passed' | 'failed' | 'warning';
  steps?: SOPStepItem[];
}

export interface SOPStep {
  id: string;
  title: string;
  status: 'passed' | 'failed' | 'pending';
  detail: string;
  imageUrl?: string;
  alertBox?: string;
}

export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  battery: number;
  model: string;
  location: string;
  imageUrl?: string;
}

export interface DeviceGroup {
  id: string;
  name: string;
  devices: Device[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'Safety' | 'Compliance' | 'Operations';
  isActive: boolean;
  recommended?: boolean;
  isStrictSequential?: boolean; // 是否强制顺序执行
}

export interface TraditionalClip {
  id: string;
  hour: string;
  timeLabel: string;
  seqNo?: string;
  duration: string;
  hasRedDot: boolean;
  hasHumanIcon: boolean;
  imageUrl: string;
  videoUrl: string;
  baseSeconds: number;
  description: string;
}

