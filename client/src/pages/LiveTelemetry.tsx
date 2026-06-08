import { useAuth } from '../auth/useAuth';
import { useRobotSocket } from '../ws/useRobotSocket';
import { Header } from '../components/Header';
import { ConnectionBanner } from '../components/ConnectionBanner';
import { Arena } from '../components/Arena';
import { RobotCard } from '../components/RobotCard';
import styles from './LiveTelemetry.module.css';

export function LiveTelemetry() {
  const { token } = useAuth();
  const { robots, connected, updateCount, lastUpdated } = useRobotSocket(token as string);

  return (
    <>
      <Header connected={connected} updateCount={updateCount} />
      <ConnectionBanner visible={!connected} />
      <main className={styles.main}>
        <Arena robots={robots} />
        <div className={styles.cardsSection}>
          <p className={styles.sectionLabel}>Robot Status</p>
          <div className={styles.cardsGrid}>
            {robots.map((robot, i) => (
              <RobotCard key={robot.id} robot={robot} index={i} lastUpdated={lastUpdated} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
