// Fetch all projects
export async function fetchProjects() {
  const response = await fetch('/api/projects');
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

// Fetch all tasks
export async function fetchTasks() {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

// Fetch all time entries
export async function fetchTimeEntries() {
  const response = await fetch('/api/time-entries');
  if (!response.ok) {
    throw new Error('Failed to fetch time entries');
  }
  return response.json();
}

// Fetch all users
export async function fetchUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
} 