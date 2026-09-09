import apiClient from './client';

export async function listTasks({ search, status, page, limit, order } = {}) {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (order !== undefined) params.order = order;

  const { data } = await apiClient.get('/tasks/me', { params });
  return data;
}

export async function createTask({ title, description }) {
  const { data } = await apiClient.post('/tasks/create', { title, description });
  return data;
}

export async function updateTask(id, { title, description }) {
  const { data } = await apiClient.put(`/tasks/update/${id}`, { title, description });
  return data;
}

export async function deleteTask(id) {
  const { data } = await apiClient.delete(`/tasks/delete/${id}`);
  return data;
}

export async function toggleTask(id) {
  const { data } = await apiClient.patch(`/tasks/toggle/${id}`);
  return data;
}
