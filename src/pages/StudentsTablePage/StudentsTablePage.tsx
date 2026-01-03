import React from 'react';
import StudentsTable from '../../components/StudentsTable/StudentsTable';
import { Button } from '@mui/material';

const StudentsTablePage: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const assignmentId = params.get('id') ?? '';

    return (
        <div>
            <div style={{ padding: '16px 20px 0 20px' }}>
                <Button variant="contained" color="primary" size="small" onClick={() => {(window.location.href = `http://localhost:8000/mod/assign/view.php?id=${assignmentId}`)}}>
                    Назад
                </Button>
            </div>
            <div style={{ padding: '20px' }}>
                <StudentsTable />
            </div>
        </div>
    );
};

export default StudentsTablePage;