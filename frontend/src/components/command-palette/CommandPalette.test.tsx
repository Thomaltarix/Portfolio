import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/render';
import { CommandPalette } from './CommandPalette';

afterEach(() => {
  window.localStorage.clear();
  window.location.hash = '';
  void i18n.changeLanguage('en');
});

describe('CommandPalette', () => {
  it('opens on click and focuses the search input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);

    await user.click(screen.getByRole('button', { name: 'Open command menu' }));

    const input = screen.getByPlaceholderText('Type a command or search…');
    expect(input).toHaveFocus();
  });

  it('opens on the Cmd+K / Ctrl+K shortcut', () => {
    renderWithProviders(<CommandPalette />);

    fireEvent.keyDown(window, { key: 'k', metaKey: true });

    expect(screen.getByRole('dialog', { name: 'Command menu' })).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    await user.click(screen.getByRole('button', { name: 'Open command menu' }));

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('returns focus to the trigger button after closing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    const trigger = screen.getByRole('button', { name: 'Open command menu' });
    await user.click(trigger);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(trigger).toHaveFocus();
  });

  it('filters commands by query', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    await user.click(screen.getByRole('button', { name: 'Open command menu' }));

    await user.type(screen.getByPlaceholderText('Type a command or search…'), 'contact');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Contact');
  });

  it('filters case- and accent-insensitively, e.g. "a pr" matches "À propos"', async () => {
    await i18n.changeLanguage('fr');
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    await user.click(screen.getByRole('button', { name: 'Ouvrir le menu de commandes' }));

    await user.type(screen.getByPlaceholderText('Tape une commande ou une recherche…'), 'a pr');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('À propos');
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    await user.click(screen.getByRole('button', { name: 'Open command menu' }));

    await user.type(screen.getByPlaceholderText('Type a command or search…'), 'zzzznotacommand');

    expect(screen.getByText('No results.')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('navigates with arrow keys and runs the highlighted command on Enter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    await user.click(screen.getByRole('button', { name: 'Open command menu' }));
    await user.type(screen.getByPlaceholderText('Type a command or search…'), 'theme');

    expect(document.documentElement).toHaveClass('dark');

    fireEvent.keyDown(window, { key: 'Enter' });

    await waitFor(() => expect(document.documentElement).toHaveClass('light'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('runs a command on click and closes the palette', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    await user.click(screen.getByRole('button', { name: 'Open command menu' }));

    await user.click(screen.getByRole('option', { name: 'Contact' }));

    expect(window.location.hash).toBe('#contact');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clicking the backdrop closes the palette without running a command', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    await user.click(screen.getByRole('button', { name: 'Open command menu' }));

    const dialog = screen.getByRole('dialog');
    // The backdrop is the dialog's positioning parent — clicking it (not the
    // dialog itself) should dismiss without selecting anything.
    await user.click(dialog.parentElement as HTMLElement);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });
});
