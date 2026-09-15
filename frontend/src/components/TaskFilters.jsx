import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25];

export function TaskFilters({
  search,
  onSearchChange,
  pageSize,
  onPageSizeChange,
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

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="page-size-label">Items per page</InputLabel>
        <Select
          labelId="page-size-label"
          id="page-size"
          value={pageSize}
          label="Items per page"
          onChange={onPageSizeChange}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
