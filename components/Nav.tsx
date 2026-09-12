import styles from './Nav.module.css';

export function Nav() {
  return (
    <nav className="nav">
      <span className={styles.brand}>
        María <b>Railenz</b> <span className={styles.soon}>— Coming soon</span>
      </span>
    </nav>
  );
}
