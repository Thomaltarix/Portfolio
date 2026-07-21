import { useMutation } from '@tanstack/react-query';
import { submitContactForm } from '../api/contact.api';

export function useSubmitContact() {
  return useMutation({
    mutationFn: submitContactForm,
  });
}
