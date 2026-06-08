export type RobotStatus = 'moving' | 'charging' | 'error' | 'idle';
export type RobotTask = 'patrolling' | 'delivery' | 'waiting' | 'charging';

export interface RobotPosition {
  x: number;
  y: number;
}

export interface Robot {
  id: string;
  position: RobotPosition;
  heading: number;
  speed: number;
  status: RobotStatus;
  battery: number;
  task: RobotTask;
}

export interface RobotUpdateMessage {
  type: 'robot_update';
  timestamp: string;
  robots: Robot[];
}
