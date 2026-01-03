import React from 'react';
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
  const userId = params.get('userid') ?? '';
  const nameParam = params.get('name') ?? '';
  const emailParam = params.get('email') ?? '';
  const gradeParam = params.get('grade') ?? '';
  const statusParam = (params.get('status') as
    | 'none'
    | 'submitted'
    | 'late'
    | 'graded') || 'submitted';
  const lastUpdatedParam = params.get('lastUpdated') ?? new Date().toLocaleString();

  // Try to read stored participant data from sessionStorage. This avoids passing extra fields via URL.
  let storedParticipant: any = null;
  try {
    const key = `grading:${assignmentId}:${userId}`;
    const raw = sessionStorage.getItem(key);
    if (raw) storedParticipant = JSON.parse(raw);
  } catch (err) {
    storedParticipant = null;
  }

  const student: StudentDetails = {
    id: userId || '0',
    name: storedParticipant?.fullname || nameParam || 'Unknown Student',
    email: storedParticipant?.email || emailParam || 'student@example.com',
    pfpUrl:
      storedParticipant?.pfpUrl ||
      params.get('pfpUrl') ||
      'https://i0.wp.com/newspack-berkeleyside-cityside.s3.amazonaws.com/wp-content/uploads/2018/10/unnamed-1.jpg?resize=780%2C437&ssl=1',
    submissionStatus: (storedParticipant?.submissionstatus as
      | 'none'
      | 'submitted'
      | 'late'
      | 'graded') || statusParam,
    lastUpdated: storedParticipant?.lastUpdated || lastUpdatedParam,
    currentGrade: String(storedParticipant?.currentgrade ?? (gradeParam || 'N/A')),
  };

  const assignmentUrl = testPdf;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', }}>
      <AssignmentNavbar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-evenly' }}>
        <AssignmentViewer assignmentUrl={assignmentUrl} />
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <StudentInfo data={student} />
          <GradingForm />
        </div>
      </div>
    </div>
  );
};

export default GradingPage;