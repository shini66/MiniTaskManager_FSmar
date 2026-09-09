import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <Card
      variant="outlined"
      sx={{
        opacity: task.completed ? 0.7 : 1,
        transition: 'opacity 0.15s ease',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, '&:last-child': { pb: 2 } }}>
        <Checkbox
          checked={task.completed}
          onChange={() => onToggle(task)}
          sx={{ mt: -0.5 }}
          inputProps={{ 'aria-label': `Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}` }}
        />

        <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              wordBreak: 'break-word',
            }}
          >
            {task.title}
          </Typography>
          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                wordBreak: 'break-word',
              }}
            >
              {task.description}
            </Typography>
          )}
        </Stack>

        <Stack direction="row">
          <Tooltip title="Edit task">
            <IconButton size="small" onClick={() => onEdit(task)} aria-label="edit task">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete task">
            <IconButton size="small" onClick={() => onDelete(task)} aria-label="delete task">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
