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
  // const assignmentId = params.get('id') ?? '';
  const userId = params.get('userid') ?? '';

  const student: StudentDetails = {
    id: userId || '0',
    name: 'Мавко Уляна',
    email: 'student@example.com',
    pfpUrl: 'https://i0.wp.com/newspack-berkeleyside-cityside.s3.amazonaws.com/wp-content/uploads/2018/10/unnamed-1.jpg?resize=780%2C437&ssl=1',
    submissionStatus: 'submitted',
    lastUpdated: '10 жовтня 2025, 17:15 PM',
    currentGrade: '5.00',
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