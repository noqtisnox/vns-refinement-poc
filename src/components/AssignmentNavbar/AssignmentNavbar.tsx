import React, { useState } from 'react';
import styles from './AssignmentNavbar.module.css';

const AssignmentNavbar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  return (
    <nav className={styles.bottomNavbar}>
      <div className={styles.navLeft}>
        <a href="#" className={styles.courseLink}>Курс: Нейромережеві технології і системи (АСУ)</a>
        <div className={styles.taskRow}>
          <a href="#" className={styles.taskLink}>Завдання: Лабораторна робота №1</a>
        </div>
        <a href="http://localhost:8000/mod/assign/view.php?id=12345&action=grading" className={styles.viewAll}>Переглянути всі роботи</a>
      </div>

      <div className={styles.navRight}>
        <button className={styles.navArrow} aria-label="Previous">◀</button>

        <div className={styles.searchGroup}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Перейти до..."
            className={styles.searchInput}
          />
          <button
            type="button"
            className={styles.filterBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Фільтр
          </button>
        </div>

        <button className={styles.navArrow} aria-label="Next">▶</button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Фільтри</h3>
            <div className={styles.filterList}>
              <label>
                <input
                  type="radio"
                  name="filter"
                  value="all"
                  checked={selectedFilter === 'all'}
                  onChange={() => setSelectedFilter('all')}
                />
                Усі
              </label>
              <label>
                <input
                  type="radio"
                  name="filter"
                  value="submitted"
                  checked={selectedFilter === 'submitted'}
                  onChange={() => setSelectedFilter('submitted')}
                />
                Здані
              </label>
              <label>
                <input
                  type="radio"
                  name="filter"
                  value="not_submitted"
                  checked={selectedFilter === 'not_submitted'}
                  onChange={() => setSelectedFilter('not_submitted')}
                />
                Не здані
              </label>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalBtn} onClick={() => setIsModalOpen(false)}>Скасувати</button>
              <button className={styles.modalBtnPrimary} onClick={() => setIsModalOpen(false)}>Застосувати</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AssignmentNavbar;