import { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function TaskDialogForm({ task, onClose, onSubmit }) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [titleError, setTitleError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    setTitleError('');

    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save the task. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogContent>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            error={Boolean(titleError)}
            helperText={titleError}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Box>
  );
}

export function TaskDialog({ open, mode, task, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'edit' ? 'Edit Task' : 'New Task'}</DialogTitle>
      {/* Keying by task id + open remounts the form with fresh initial
          values whenever a different task (or a new blank task) is opened,
          instead of syncing state via an effect. */}
      <TaskDialogForm
        key={open ? `${mode}-${task?._id ?? 'new'}` : 'closed'}
        task={task}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}
