import type { Robot } from '../types/robot';
import styles from './RobotCard.module.css';

const ROBOT_COLORS = ['#818cf8', '#34d399', '#f472b6', '#fb923c', '#38bdf8'];

const STATUS_CLASS: Record<Robot['status'], string> = {
  moving:   styles.statusMoving,
  charging: styles.statusCharging,
  error:    styles.statusError,
  idle:     styles.statusIdle,
};

const BADGE_CLASS: Record<Robot['status'], string> = {
  moving:   styles.badgeMoving,
  charging: styles.badgeCharging,
  error:    styles.badgeError,
  idle:     styles.badgeIdle,
};

function batteryColor(pct: number): string {
  if (pct < 20) return '#ef4444';
  if (pct < 50) return '#f59e0b';
  return '#22c55e';
}

interface Props {
  robot: Robot;
  index: number;
  lastUpdated: Date | null;
}

export function RobotCard({ robot: r, index, lastUpdated }: Props) {
  const color = ROBOT_COLORS[index % ROBOT_COLORS.length];

  return (
    <div className={`${styles.card} ${STATUS_CLASS[r.status]}`}>
      <div className={styles.cardHeader}>
        <span className={styles.robotId} style={{ color }}>
          {r.id.replace('_', ' ').toUpperCase()}
        </span>
        <span className={`${styles.badge} ${BADGE_CLASS[r.status]}`}>{r.status}</span>
      </div>
      <div className={styles.batteryRow}>
        <span className={styles.batteryLabel}>Battery</span>
        <div className={styles.batteryTrack}>
          <div
            className={styles.batteryFill}
            style={{ width: `${r.battery}%`, backgroundColor: batteryColor(r.battery) }}
          />
        </div>
        <span className={styles.batteryPct}>{r.battery.toFixed(1)}%</span>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Position</span>
          <span className={styles.statValue}>({r.position.x}, {r.position.y})</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Heading</span>
          <span className={styles.statValue}>{r.heading}°</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Speed</span>
          <span className={styles.statValue}>{r.speed} m/s</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Task</span>
          <span className={styles.statValue}>{r.task}</span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''}
      </div>
    </div>
  );
}
