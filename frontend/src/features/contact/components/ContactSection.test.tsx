import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/render';
import { ContactSection } from './ContactSection';

const { submitContactFormMock } = vi.hoisted(() => ({
  submitContactFormMock: vi.fn(),
}));

vi.mock('../api/contact.api', () => ({
  submitContactForm: submitContactFormMock,
}));

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
  await user.type(screen.getByLabelText('Email'), 'ada@example.com');
  await user.type(
    screen.getByLabelText('Message'),
    'Hello, I would like to get in touch about a project.',
  );
}

describe('ContactSection', () => {
  afterEach(() => {
    submitContactFormMock.mockReset();
  });

  it('shows validation errors and does not submit when fields are empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactSection />);

    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText('Name must be at least 2 characters.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Message must be at least 10 characters.')).toBeInTheDocument();
    expect(submitContactFormMock).not.toHaveBeenCalled();
  });

  it('submits the form and shows a success message', async () => {
    submitContactFormMock.mockResolvedValue({ id: 'message-id' });
    const user = userEvent.setup();
    renderWithProviders(<ContactSection />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(submitContactFormMock.mock.calls[0][0]).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello, I would like to get in touch about a project.',
    });
    expect(await screen.findByText("Thanks — your message was sent.")).toBeInTheDocument();
  });

  it('resets the form fields after a successful submission', async () => {
    submitContactFormMock.mockResolvedValue({ id: 'message-id' });
    const user = userEvent.setup();
    renderWithProviders(<ContactSection />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('');
    });
  });

  it('shows an error message when the submission fails', async () => {
    submitContactFormMock.mockRejectedValue(new Error('Server error'));
    const user = userEvent.setup();
    renderWithProviders(<ContactSection />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(
      await screen.findByText('Something went wrong. Please try again.'),
    ).toBeInTheDocument();
  });

  it('disables the submit button and shows a pending label while submitting', async () => {
    let resolveSubmit!: (value: { id: string }) => void;
    submitContactFormMock.mockReturnValue(
      new Promise((resolve) => {
        resolveSubmit = resolve;
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(<ContactSection />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    const pendingButton = await screen.findByRole('button', { name: 'Sending…' });
    expect(pendingButton).toBeDisabled();

    resolveSubmit({ id: 'message-id' });
    await screen.findByText("Thanks — your message was sent.");
  });
});
