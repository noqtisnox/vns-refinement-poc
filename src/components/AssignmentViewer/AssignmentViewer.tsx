import React from 'react';
import './AssignmentViewer.css';

const MAX_PDF_WIDTH = 800;

type Props = {
  assignmentUrl: string;
  containerWidth?: number; 
}

const AssignmentViewer: React.FC<Props> = ({ assignmentUrl }) => { 
  if (!assignmentUrl) {
    return (
      <div className='viewer__no-file'>
        <p className='no-file__title'>No Assignment File Provided</p>
        <p className='no-file__message'>Please ensure the student has uploaded a submission.</p>
      </div>
    );
  }

  return (
    <div className='viewer__container'>
      <div 
        className='pdf-display-area'
        style={{ maxWidth: `${MAX_PDF_WIDTH}px`, height: '90vh' }} 
      >
        <iframe 
          src={assignmentUrl}
          title='Assignment PDF Viewer'
          className='pdf-embed'
        >
        </iframe>
      </div>
    </div>
  );
};

export default AssignmentViewer;