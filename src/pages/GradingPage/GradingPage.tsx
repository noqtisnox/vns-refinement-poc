import React from 'react';
import StudentInfo from '../../components/StudentInfo/StudentInfo';
import './GradingPage.css';
import type { StudentDetails } from '../../types/types';
import AssignmentViewer from '../../components/AssignmentViewer/AssignmentViewer';
import testPdf from '../../assets/pdf/test-pdf.pdf';
import GradingForm from '../../components/GradingForm/GradingForm';
import BottomNavbar from '../../components/BottomNavbar/BottomNavbar';

const GradingPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  // const assignmentId = params.get('id') ?? '';
  const userId = params.get('userid') ?? '';

  const student: StudentDetails = {
    id: userId || '0',
    name: 'Student Name',
    email: 'student@example.com',
    pfpUrl: '',
    submissionStatus: 'submitted',
    lastUpdated: 'Unknown',
    currentGrade: '—',
  };

  const assignmentUrl = testPdf;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', }}>
      <StudentInfo data={student} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-evenly' }}>
        <AssignmentViewer assignmentUrl={assignmentUrl} />
        <GradingForm />
      </div>
      <BottomNavbar />
    </div>
  );
};

export default GradingPage;