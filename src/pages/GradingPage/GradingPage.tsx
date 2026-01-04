import React, { useEffect, useState, useCallback } from 'react';
import StudentInfo from '../../components/StudentInfo/StudentInfo';
import './GradingPage.css';
import type { StudentDetails } from '../../types/types';
import AssignmentViewer from '../../components/AssignmentViewer/AssignmentViewer';
import testPdf from '../../assets/pdf/test-pdf.pdf';
import GradingForm from '../../components/GradingForm/GradingForm';
import AssignmentNavbar from '../../components/AssignmentNavbar/AssignmentNavbar';

const GradingPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const assignmentId = params.get('id') ?? '';
  const initialUserId = params.get('userid') ?? '';

  const [studentList, setStudentList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [student, setStudent] = useState<StudentDetails | null>(null);

  useEffect(() => {
    // load stored list for this assignment
    try {
      const listKey = `grading:list:${assignmentId}`;
      const rawList = sessionStorage.getItem(listKey);
      if (rawList) {
        const arr = JSON.parse(rawList);
        if (Array.isArray(arr)) setStudentList(arr);
      }
    } catch (e) {
      // ignore
    }
    // if no stored list found, try loading participants.json as a fallback
    (async () => {
      try {
        const listKey = `grading:list:${assignmentId}`;
        const rawList = sessionStorage.getItem(listKey);
        if (!rawList) {
          const res = await fetch('/data/participants.json');
          if (!res.ok) return;
          const json = await res.json();
          const data = Array.isArray(json) && json.length > 0 && json[0].data ? json[0].data : [];
          if (Array.isArray(data) && data.length > 0) setStudentList(data as any[]);
        }
      } catch (err) {
        // ignore
      }
    })();
  }, [assignmentId]);

  const loadStudentFromStorage = useCallback((userId: string) => {
    const params = new URLSearchParams(window.location.search);
    const assignmentIdLocal = params.get('id') ?? assignmentId;
    try {
      const key = `grading:${assignmentIdLocal}:${userId}`;
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const stored = JSON.parse(raw);
        return stored;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }, [assignmentId]);

  useEffect(() => {
    // determine initial student either from stored list or from session storage key
    let initialStudent: any = null;
    if (studentList.length > 0 && initialUserId) {
      const idx = studentList.findIndex((s) => String(s.id) === String(initialUserId));
      if (idx >= 0) {
        setCurrentIndex(idx);
        initialStudent = studentList[idx];
      }
    }

    if (!initialStudent && initialUserId) {
      initialStudent = loadStudentFromStorage(initialUserId) || null;
    }

    if (initialStudent) {
      setStudent({
        id: String(initialStudent.id),
        name: initialStudent.fullname || initialStudent.name || initialStudent.username || 'Unknown Student',
        email: initialStudent.email || 'student@example.com',
        pfpUrl: initialStudent.pfpUrl || initialStudent.picture || '',
        submissionStatus: initialStudent.submissionstatus || 'submitted',
        lastUpdated: initialStudent.lastUpdated || new Date().toLocaleString(),
        currentGrade: String(initialStudent.currentgrade ?? 'N/A'),
      });
    }
  }, [studentList, initialUserId, loadStudentFromStorage]);

  const goToIndex = (idx: number) => {
    if (!studentList || idx < 0 || idx >= studentList.length) return;
    selectAndShow(studentList, idx);
  };

  const selectAndShow = (list: any[], idx: number) => {
    if (!Array.isArray(list) || idx < 0 || idx >= list.length) return;
    const s = list[idx];
    const userId = String(s.id);
    try {
      const key = `grading:${assignmentId}:${userId}`;
      sessionStorage.setItem(key, JSON.stringify(s));
    } catch (e) {
      // ignore
    }
    const url = new URL(window.location.href);
    url.searchParams.set('userid', userId);
    window.history.replaceState({}, '', url.toString());
    setStudentList(list);
    setCurrentIndex(idx);
    setStudent({
      id: userId,
      name: s.fullname || s.name || s.username || 'Unknown Student',
      email: s.email || 'student@example.com',
      pfpUrl: s.pfpUrl || s.picture || '',
      submissionStatus: s.submissionstatus || 'submitted',
      lastUpdated: s.lastUpdated || new Date().toLocaleString(),
      currentGrade: String(s.currentgrade ?? 'N/A'),
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) goToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < studentList.length - 1) goToIndex(currentIndex + 1);
  };

  const assignmentUrl = testPdf;

  const handleSearchEnter = (q: string) => {
    const ql = q.trim().toLowerCase();
    if (!ql) return;
    const idx = studentList.findIndex((s) => {
      const idStr = String(s.id || '');
      const fullname = String(s.fullname || s.name || s.username || '').toLowerCase();
      const email = String(s.email || '').toLowerCase();
      return idStr === ql || fullname.includes(ql) || email.includes(ql);
    });
    if (idx >= 0) goToIndex(idx);
  };

  const suggestions = studentList.map((s) => ({ id: String(s.id), label: s.fullname || s.name || s.username || String(s.id), email: s.email }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', }}>
      <AssignmentNavbar
        searchQuery={undefined}
        setSearchQuery={undefined}
        onPrev={handlePrev}
        onNext={handleNext}
        onSearchEnter={handleSearchEnter}
        suggestions={suggestions}
      />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-evenly' }}>
        <AssignmentViewer assignmentUrl={assignmentUrl} />
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          {student && <StudentInfo data={student} />}
          <GradingForm assignmentId={assignmentId} student={student as StudentDetails} onSaveSuccess={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default GradingPage;