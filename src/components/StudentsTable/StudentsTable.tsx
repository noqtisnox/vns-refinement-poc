import React, { useEffect, useMemo, useState } from 'react';
import {
  MRT_GlobalFilterTextField,
  MRT_TableBodyCellValue,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  flexRender,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

type Participant = {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  email?: string;
  city?: string;
  submissionstatus?: string;
  currentgrade?: string | null;
  comment?: string | null;
};

type Controls = {
  prev: () => void;
  next: () => void;
  findAndNavigate: (query: string) => void;
};

type Props = {
  searchQuery?: string;
  onRegisterControls?: (c: Controls) => void;
};

const StudentsTable: React.FC<Props> = ({ searchQuery = '', onRegisterControls }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [submittedFilter, setSubmittedFilter] = useState<string>('');
  const [requireGradingFilter, setRequireGradingFilter] = useState<string>('');
  const [grantedExtensionFilter, setGrantedExtensionFilter] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const fetchParticipants = async () => {
      try {
        // For local dev use the bundled JSON file. Replace with service endpoint in production.
        const res = await fetch('/data/participants.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = Array.isArray(json) && json.length > 0 && json[0].data ? json[0].data : [];
        if (mounted) setParticipants(data as Participant[]);
        console.log('Учасники завантажені.', data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Не вдалося завантажити учасників...', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchParticipants();
    return () => {
      mounted = false;
    };
  }, []);

  const columns = useMemo<MRT_ColumnDef<Participant>[]>(
    () => [
      { accessorKey: 'fullname', header: 'Прізвище/Ім\'я' },
      { accessorKey: 'email', header: 'Електронна пошта' },
      { accessorKey: 'submissionstatus', header: 'Статус подання' },
      { accessorKey: 'currentgrade', header: 'Оцінка' },
      {
        id: 'grade',
        header: '',
        accessorFn: (row) => row.id,
        Cell: ({ row }) => {
          const userId = row.original.id;
          const handleClick = () => {
            try {
              const params = new URLSearchParams(window.location.search);
              const assignmentId = params.get('id') ?? '0';
              const key = `grading:${assignmentId}:${userId}`;
              // store the full participant object for the grading page to read
              try {
                sessionStorage.setItem(key, JSON.stringify(row.original));
                // also store the current visible list so grader can navigate sequentially
                try {
                  const rows = table.getRowModel().rows;
                  const listKey = `grading:list:${assignmentId}`;
                  sessionStorage.setItem(listKey, JSON.stringify(rows.map((r) => r.original)));
                } catch (e) {
                  // ignore
                }
              } catch (e) {
                // ignore storage errors
                // eslint-disable-next-line no-console
                console.error('sessionStorage setItem failed', e);
              }
            } finally {
              const params = new URLSearchParams(window.location.search);
              const assignmentId = params.get('id') ?? '0';
              const url = `http://localhost:8000/mod/assign/view.php?id=${assignmentId}&action=grader&userid=${userId}`;
              window.location.href = url;
            }
          };
          return (
            <Button variant="contained" color="primary" size="small" onClick={handleClick}>
              Оцінити роботу
            </Button>
          );
        },
      },
    ],
    [],
  );

  const groupOptions = useMemo(() => {
    const s = new Set<string>();
    participants.forEach((p) => {
      const groups = (p as any).groups;
      if (!Array.isArray(groups)) return;
      groups.forEach((g: any) => {
        if (!g) return;
        if (typeof g === 'string') {
          s.add(g);
          return;
        }
        if (typeof g === 'object') {
          if (g.name) s.add(String(g.name));
          else if (g.groupname) s.add(String(g.groupname));
          else if (g.group) s.add(String(g.group));
        }
      });
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [participants]);

  const statusOptions = useMemo(() => {
    const s = new Set<string>();
    participants.forEach((p) => {
      if (p.submissionstatus) s.add(p.submissionstatus);
    });
    // provide common statuses if none discovered
    if (s.size === 0) {
      ['submitted', 'none', 'late', 'graded'].forEach((st) => s.add(st));
    }
    return Array.from(s);
  }, [participants]);

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      // group filter
      if (selectedGroups.length > 0) {
        const groups = (p as any).groups;
        const groupNames = Array.isArray(groups) ? groups.map((g: any) => g.name) : [];
        if (!groupNames.some((gn: string) => selectedGroups.includes(gn))) return false;
      }
      // status filter
      if (selectedStatuses.length > 0) {
        if (!selectedStatuses.includes(String(p.submissionstatus))) return false;
      }
      // submitted (boolean) filter
      if (submittedFilter !== '') {
        const val = submittedFilter === 'true';
        if (Boolean((p as any).submitted) !== val) return false;
      }
      // requiregrading (boolean) filter
      if (requireGradingFilter !== '') {
        const val = requireGradingFilter === 'true';
        if (Boolean((p as any).requiregrading) !== val) return false;
      }
      // grantedextension (boolean) filter
      if (grantedExtensionFilter !== '') {
        const val = grantedExtensionFilter === 'true';
        if (Boolean((p as any).grantedextension) !== val) return false;
      }
      return true;
    });
  }, [participants, selectedGroups, selectedStatuses]);

  const table = useMaterialReactTable({
    columns,
    data: filtered,
    enableRowSelection: true,
    initialState: { pagination: { pageSize: 10, pageIndex: 0 }, showGlobalFilter: true },
    muiPaginationProps: { rowsPerPageOptions: [10, 20, 50, 100], variant: 'outlined' },
    paginationDisplayMode: 'pages',
  });

  React.useEffect(() => {
    if (!table) return;
    // sync external search query into MRT global filter
    // @ts-ignore
    if (typeof table.setGlobalFilter === 'function') table.setGlobalFilter(searchQuery);
  }, [searchQuery, table]);

  React.useEffect(() => {
    if (!onRegisterControls) return;
    const controls: Controls = {
      prev: () => {
        const rows = table.getRowModel().rows;
        if (!rows || rows.length === 0) return;
        // navigate to previous of first visible (simple behavior)
        const target = rows[0];
        if (!target) return;
        const participant = target.original as Participant;
        const params = new URLSearchParams(window.location.search);
        const assignmentId = params.get('id') ?? '0';
        const key = `grading:${assignmentId}:${participant.id}`;
        try { sessionStorage.setItem(key, JSON.stringify(participant)); } catch (e) { console.error('sessionStorage setItem failed', e); }
        const url = `http://localhost:8000/mod/assign/view.php?id=${assignmentId}&action=grader&userid=${participant.id}`;
        window.location.href = url;
      },
      next: () => {
        const rows = table.getRowModel().rows;
        if (!rows || rows.length === 0) return;
        const target = rows[0];
        if (!target) return;
        const participant = target.original as Participant;
        const params = new URLSearchParams(window.location.search);
        const assignmentId = params.get('id') ?? '0';
        const key = `grading:${assignmentId}:${participant.id}`;
        try { sessionStorage.setItem(key, JSON.stringify(participant)); } catch (e) { console.error('sessionStorage setItem failed', e); }
        const url = `http://localhost:8000/mod/assign/view.php?id=${assignmentId}&action=grader&userid=${participant.id}`;
        window.location.href = url;
      },
      findAndNavigate: (q: string) => {
        const rows = table.getRowModel().rows;
        if (!rows || rows.length === 0) return;
        const ql = q.trim().toLowerCase();
        if (!ql) return;
        const found = rows.find((r) => {
          const p = r.original as Participant;
          const fullname = String(p.fullname || '').toLowerCase();
          const email = String(p.email || '').toLowerCase();
          return fullname.includes(ql) || email.includes(ql) || String(p.id) === ql;
        });
        if (!found) return;
        const participant = found.original as Participant;
        const params = new URLSearchParams(window.location.search);
        const assignmentId = params.get('id') ?? '0';
        const listKey = `grading:list:${assignmentId}`;
        try { sessionStorage.setItem(listKey, JSON.stringify(rows.map((r) => r.original))); } catch (e) { /* ignore */ }
        const key = `grading:${assignmentId}:${participant.id}`;
        try { sessionStorage.setItem(key, JSON.stringify(participant)); } catch (e) { /* ignore */ }
        const url = `http://localhost:8000/mod/assign/view.php?id=${assignmentId}&action=grader&userid=${participant.id}`;
        window.location.href = url;
      },
    };
    onRegisterControls(controls);
  }, [onRegisterControls, table]);

  return (
    <Stack sx={{ m: '2rem 0' }}>
      <Typography variant="h4">Подання</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <MRT_GlobalFilterTextField table={table} />
            <Tooltip title="Перейти до послідовного оцінювання">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  const assignmentId = params.get('id') ?? '0';
                  const rows = table.getRowModel().rows;
                  if (!rows || rows.length === 0) return;
                  const first = rows[0].original as Participant;
                  const userId = first.id;
                  const key = `grading:${assignmentId}:${userId}`;
                  try {
                    sessionStorage.setItem(key, JSON.stringify(first));
                    // also store the current visible list so grader can navigate sequentially
                    const listKey = `grading:list:${assignmentId}`;
                    const list = rows.map((r) => r.original);
                    sessionStorage.setItem(listKey, JSON.stringify(list));
                  } catch (e) {
                    // ignore storage errors
                    // eslint-disable-next-line no-console
                    console.error('sessionStorage setItem failed', e);
                  }
                  const url = `http://localhost:8000/mod/assign/view.php?id=${assignmentId}&action=grader&userid=${userId}`;
                  window.location.href = url;
                }}
              >
                <ModeEditIcon />
              </Button>
            </Tooltip>
          </Box>
          <MRT_TablePagination table={table} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="group-filter-label">Група</InputLabel>
            <Select
              labelId="group-filter-label"
              multiple
              value={selectedGroups}
              onChange={(e) => setSelectedGroups(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
              input={<OutlinedInput label="Група" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {groupOptions.map((g) => (
                <MenuItem key={g} value={g}>
                  <Checkbox checked={selectedGroups.indexOf(g) > -1} />
                  <ListItemText primary={g} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Статус</InputLabel>
            <Select
              labelId="status-filter-label"
              multiple
              value={selectedStatuses}
              onChange={(e) => setSelectedStatuses(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
              input={<OutlinedInput label="Статус" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  <Checkbox checked={selectedStatuses.indexOf(s) > -1} />
                  <ListItemText primary={s} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="submitted-filter-label">Подано</InputLabel>
            <Select
              labelId="submitted-filter-label"
              value={submittedFilter}
              onChange={(e) => setSubmittedFilter(String(e.target.value))}
              input={<OutlinedInput label="Подано" />}
            >
              <MenuItem value="">Усі</MenuItem>
              <MenuItem value="true">Так</MenuItem>
              <MenuItem value="false">Ні</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="require-filter-label">Потрібна оцінка</InputLabel>
            <Select
              labelId="require-filter-label"
              value={requireGradingFilter}
              onChange={(e) => setRequireGradingFilter(String(e.target.value))}
              input={<OutlinedInput label="Потрібна оцінка" />}
            >
              <MenuItem value="">Усі</MenuItem>
              <MenuItem value="true">Так</MenuItem>
              <MenuItem value="false">Ні</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="granted-filter-label">Подовження</InputLabel>
            <Select
              labelId="granted-filter-label"
              value={grantedExtensionFilter}
              onChange={(e) => setGrantedExtensionFilter(String(e.target.value))}
              input={<OutlinedInput label="Подовження" />}
            >
              <MenuItem value="">Усі</MenuItem>
              <MenuItem value="true">Так</MenuItem>
              <MenuItem value="false">Ні</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Typography>Завантаження…</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell align="center" variant="head" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.Header ?? header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow key={row.id} selected={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell align="center" variant="body" key={cell.id}>
                      <MRT_TableBodyCellValue cell={cell} table={table} staticRowIndex={rowIndex} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
    </Stack>
  );
};

export default StudentsTable;
