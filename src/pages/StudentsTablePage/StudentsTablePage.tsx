import React, { useState } from 'react';
import StudentsTable from '../../components/StudentsTable/StudentsTable';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  TextField, 
  InputAdornment 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

const StudentsTablePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const params = new URLSearchParams(window.location.search);
    const assignmentId = params.get('id') ?? '';

    const handleBack = () => {
        window.location.href = `http://localhost:8000/mod/assign/view.php?id=${assignmentId}`;
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
            <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
                <Toolbar>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={handleBack}
                        sx={{ mr: 2 }}
                    >
                        Назад
                    </Button>
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Лабораторна робота №1
                    </Typography>

                    <TextField
                        size="small"
                        placeholder="Пошук студента..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ width: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
                <StudentsTable searchQuery={searchQuery} />
            </Container>
        </Box>
    );
};

export default StudentsTablePage;