import styles from './Header.module.css';

interface Props {
  connected: boolean;
  updateCount: number;
}

export function Header({ connected, updateCount }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Robot Fleet Dashboard</h1>
      <div className={styles.right}>
        <span>Updates: {updateCount}</span>
        <span>
          <span className={`${styles.dot} ${connected ? styles.connected : styles.disconnected}`} />
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </header>
  );
}
