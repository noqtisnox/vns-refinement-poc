import React, { useState } from 'react';
import styles from './AssignmentNavbar.module.css';
import { TextField, InputAdornment, IconButton, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type Props = {
  searchQuery?: string;
  setSearchQuery?: (s: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onSearchEnter?: (s: string) => void;
  suggestions?: { id: string; label: string; email?: string }[];
};

const AssignmentNavbar: React.FC<Props> = ({ searchQuery, setSearchQuery, onPrev, onNext, onSearchEnter, suggestions }) => {
  const [localQuery, setLocalQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const query = searchQuery !== undefined ? searchQuery : localQuery;

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
        <button className={styles.navArrow} aria-label="Previous" onClick={onPrev}>◀</button>

        <div className={styles.searchGroup}>
          {suggestions && suggestions.length > 0 ? (
            <Autocomplete
              freeSolo
              options={suggestions || []} // Pass the whole object array
              getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
              inputValue={query}
              onInputChange={(_, value) => {
                if (setSearchQuery) setSearchQuery(value);
                else setLocalQuery(value);
              }}
              onChange={(_, value) => {
                // value can be a string (from freeSolo) or a suggestion object
                const val = typeof value === 'string' ? value : value?.label;
                if (val && onSearchEnter) {
                  onSearchEnter(val);
                }
              }}
              sx={{ width: 260 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Перейти до..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSearchEnter?.(query);
                    }
                  }}
                />
              )}
            />
          ) : (
            <TextField
              size="small"
              variant="outlined"
              value={query}
              onChange={(e) => {
                if (setSearchQuery) setSearchQuery(e.target.value);
                else setLocalQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && typeof onSearchEnter === 'function') {
                  onSearchEnter((e.target as HTMLInputElement).value);
                }
              }}
              placeholder="Перейти до..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" aria-label="search" onClick={() => onSearchEnter && onSearchEnter(query)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className={styles.searchInput}
            />
          )}
          <button
            type="button"
            className={styles.filterBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Фільтр
          </button>
        </div>

        <button className={styles.navArrow} aria-label="Next" onClick={onNext}>▶</button>
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