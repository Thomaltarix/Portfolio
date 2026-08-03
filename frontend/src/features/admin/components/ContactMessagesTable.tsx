import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useContactMessages } from '@/features/contact/hooks/use-contact-messages';
import { useDeleteMessage } from '@/features/contact/hooks/use-delete-message';
import { useMarkMessageRead } from '@/features/contact/hooks/use-mark-message-read';
import { cn } from '@/lib/cn';

export function ContactMessagesTable() {
  const { data: messages, isLoading, isError } = useContactMessages();
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement...</p>;
  if (isError) return <p className="text-sm text-red-400">Impossible de charger les messages.</p>;
  if (!messages || messages.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun message pour le moment.</p>;
  }

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Supprimer le message de "${name}" ?`)) return;
    deleteMessage.mutate(id);
  };

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <Card
          key={message.id}
          className={cn('space-y-2 p-4', !message.read && 'border-accent/40')}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium">
                {message.name}
                {!message.read && (
                  <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                    Non lu
                  </span>
                )}
              </p>
              <a
                href={`mailto:${message.email}`}
                className="text-sm text-muted-foreground hover:text-accent"
              >
                {message.email}
              </a>
            </div>
            <p className="shrink-0 text-xs text-muted-foreground">
              {new Date(message.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <p className="whitespace-pre-wrap text-sm text-foreground">{message.message}</p>

          <div className="flex gap-2 pt-1">
            {!message.read && (
              <Button size="sm" variant="outline" onClick={() => markRead.mutate(message.id)}>
                Marquer comme lu
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(message.id, message.name)}
            >
              Supprimer
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
