import React from 'react';
import styles from './BottomNavbar.module.css';

const BottomNavbar: React.FC = () => {
  return (
    <nav className={styles.bottomNavbar}>
      {/* Left Section */}
      <div className={styles.navLeft}>
        <a href="#" className={styles.courseLink}>Курс: Нейромережеві технології і системи (АСУ)</a>
        <div className={styles.taskRow}>
          <a href="#" className={styles.taskLink}>Завдання: Лабораторна робота №1</a>
          <span className="edit-icon">✎</span>
        </div>
        <a href="http://localhost:8000/mod/assign/view.php?id=12345&action=grading" className={styles.viewAll}>Переглянути всі роботи</a>
      </div>

      {/* Right Section */}
      <div className={styles.navRight}>
        <div className={styles.studentSelector}>
          <button className={styles.navArrow}>◀</button>
          <select className={styles.studentDropdown}>
            <option>Змінити студента</option>
          </select>
          <button className={styles.navArrow}>▶</button>
        </div>

        <div className={styles.statsGroup}>
          <span className={styles.counter}>120 з 160</span>
          <span className={styles.filterIcon}>▼</span>
          <button className={styles.resetBtn}>Скинути таблицю вибору</button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;