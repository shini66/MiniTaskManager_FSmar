import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  order,
  onOrderToggle,
  onCreateClick,
}) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ alignItems: { xs: 'stretch', sm: 'center' }, mb: 3 }}
    >
      <TextField
        placeholder="Search tasks…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ flexGrow: 1 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <ToggleButtonGroup
        value={status}
        exclusive
        onChange={(_, value) => value !== null && onStatusChange(value)}
        size="small"
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="pending">Pending</ToggleButton>
        <ToggleButton value="completed">Completed</ToggleButton>
      </ToggleButtonGroup>

      <Tooltip title={order === 1 ? 'Oldest first' : 'Newest first'}>
        <IconButton onClick={onOrderToggle} size="small">
          {order === 1 ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateClick}>
        New Task
      </Button>
    </Stack>
  );
}
