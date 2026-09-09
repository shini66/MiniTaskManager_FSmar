import { useCallback, useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import * as tasksApi from '../api/tasks';
import { TaskFilters } from '../components/TaskFilters';
import { TaskCard } from '../components/TaskCard';
import { TaskDialog } from '../components/TaskDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const PAGE_LIMIT = 10;

export function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [status, setStatus] = useState('all');
  const [order, setOrder] = useState(-1);

  const [dialogState, setDialogState] = useState({ open: false, mode: 'create', task: null });
  const [deleteState, setDeleteState] = useState({ open: false, task: null });

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status === 'all' ? undefined : status,
      page,
      limit: PAGE_LIMIT,
      order,
    }),
    [debouncedSearch, status, page, order],
  );

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await tasksApi.listTasks(queryParams);
      setTasks(data.tasks);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset to first page whenever filters change.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, order]);

  function handleSearchChange(value) {
    setSearch(value);
  }

  function handleStatusChange(value) {
    setStatus(value);
  }

  function handleOrderToggle() {
    setOrder((prev) => (prev === 1 ? -1 : 1));
  }

  function openCreateDialog() {
    setDialogState({ open: true, mode: 'create', task: null });
  }

  function openEditDialog(task) {
    setDialogState({ open: true, mode: 'edit', task });
  }

  function closeDialog() {
    setDialogState((prev) => ({ ...prev, open: false }));
  }

  async function handleDialogSubmit(values) {
    if (dialogState.mode === 'edit' && dialogState.task) {
      await tasksApi.updateTask(dialogState.task._id, values);
    } else {
      await tasksApi.createTask(values);
    }
    closeDialog();
    await fetchTasks();
  }

  async function handleToggle(task) {
    try {
      await tasksApi.toggleTask(task._id);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to update the task.');
    }
  }

  function openDeleteDialog(task) {
    setDeleteState({ open: true, task });
  }

  function closeDeleteDialog() {
    setDeleteState({ open: false, task: null });
  }

  async function handleDeleteConfirm() {
    if (!deleteState.task) return;
    await tasksApi.deleteTask(deleteState.task._id);
    closeDeleteDialog();
    await fetchTasks();
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Tasks
      </Typography>

      <TaskFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        order={order}
        onOrderToggle={handleOrderToggle}
        onCreateClick={openCreateDialog}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Stack spacing={1.5}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={72} />
          ))}
        </Stack>
      ) : tasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ChecklistRtlIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" color="text.secondary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search || status !== 'all'
              ? 'Try adjusting your filters.'
              : 'Create your first task to get started.'}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <TaskDialog
        open={dialogState.open}
        mode={dialogState.mode}
        task={dialogState.task}
        onClose={closeDialog}
        onSubmit={handleDialogSubmit}
      />

      <DeleteConfirmDialog
        open={deleteState.open}
        task={deleteState.task}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
