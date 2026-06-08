import styles from './ConnectionBanner.module.css';

interface Props {
  visible: boolean;
}

export function ConnectionBanner({ visible }: Props) {
  if (!visible) return null;
  return (
    <div className={styles.banner}>
      Disconnected from server — reconnecting…
    </div>
  );
}
