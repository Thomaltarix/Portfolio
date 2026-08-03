import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '../api/projects.api';
import type { ProjectInput } from '../types/project.types';

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProjectInput> }) =>
      updateProject(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
