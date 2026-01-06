import React, { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  // MRT_GlobalFilterTextField,
  MRT_TablePagination,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Stack,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  CircularProgress,
  Link,
  Divider
} from '@mui/material';

type Participant = {
  id: number;
  fullname?: string;
  email?: string;
  submissionstatus?: string;
  currentgrade?: string | null;
  groups?: Array<{ name: string } | string>;
};

const StudentsTable: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for filters
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch('/data/participants.json');
        const json = await res.json();
        const data = Array.isArray(json) && json[0]?.data ? json[0].data : [];
        setParticipants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  // Helper for Navigation
  const handleNavigate = (participant: Participant) => {
    const params = new URLSearchParams(window.location.search);
    const assignmentId = params.get('id') ?? '0';
    sessionStorage.setItem(`grading:${assignmentId}:${participant.id}`, JSON.stringify(participant));
    sessionStorage.setItem(`grading:list:${assignmentId}`, JSON.stringify(filteredData));
    window.location.href = `http://localhost:8000/mod/assign/view.php?id=${assignmentId}&action=grader&userid=${participant.id}`;
  };

  // Extract unique groups and statuses for sidebar
  const groupOptions = useMemo(() => {
    const s = new Set<string>();
    participants.forEach((p) => {
      p.groups?.forEach((g) => {
        const name = typeof g === 'string' ? g : g?.name;
        if (name) s.add(name);
      });
    });
    return ['All', ...Array.from(s).sort()];
  }, [participants]);

  const statusOptions = useMemo(() => {
    const s = new Set<string>();
    participants.forEach((p) => {
      if (p.submissionstatus) s.add(p.submissionstatus);
    });
    return ['All', ...Array.from(s).sort()];
  }, [participants]);

  // Combined Filtering Logic
  const filteredData = useMemo(() => {
    return participants.filter((p) => {
      const matchesGroup = selectedGroup === 'All' || 
        p.groups?.some(g => (typeof g === 'string' ? g : g.name) === selectedGroup);
      
      const matchesStatus = selectedStatus === 'All' || 
        p.submissionstatus === selectedStatus;

      return matchesGroup && matchesStatus;
    });
  }, [participants, selectedGroup, selectedStatus]);

  const columns = useMemo<MRT_ColumnDef<Participant>[]>(() => [
    { 
      accessorKey: 'fullname', 
      header: 'Прізвище/Ім\'я',
      Cell: ({ renderedCellValue, row }) => (
        <Link 
          component="button" 
          variant="body1" 
          onClick={() => handleNavigate(row.original)}
          sx={{ fontWeight: 'bold', textDecoration: 'none', textAlign: 'left' }}
        >
          {renderedCellValue}
        </Link>
      )
    },
    { accessorKey: 'email', header: 'Електронна пошта' },
    { accessorKey: 'submissionstatus', header: 'Статус' },
    { accessorKey: 'currentgrade', header: 'Оцінка' },
  ], [filteredData]);

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableTopToolbar: false,
    muiTablePaperProps: { elevation: 0 },
    state: { globalFilter: searchQuery },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 4 }}>
      
      {/* Sidebar Filters */}
      <Paper variant="outlined" sx={{ p: 2, height: 'fit-content', position: 'sticky', top: '20px' }}>
        <Stack spacing={3}>
          {/* Group Filter */}
          <Box>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
              Група
            </Typography>
            <FormControl>
              <RadioGroup value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                {groupOptions.map((group) => (
                  <FormControlLabel 
                    key={group} 
                    value={group} 
                    control={<Radio size="small" />} 
                    label={<Typography variant="body2">{group}</Typography>} 
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider />

          {/* Status Filter */}
          <Box>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
              Статус подання
            </Typography>
            <FormControl>
              <RadioGroup value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                {statusOptions.map((status) => (
                  <FormControlLabel 
                    key={status} 
                    value={status} 
                    control={<Radio size="small" />} 
                    label={<Typography variant="body2">{status}</Typography>} 
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {/* Table Section */}
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <MRT_TablePagination table={table} />
        </Stack>
        <MaterialReactTable table={table} />
      </Stack>
    </Box>
  );
};

export default StudentsTable;