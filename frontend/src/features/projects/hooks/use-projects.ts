import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/projects.api';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}
