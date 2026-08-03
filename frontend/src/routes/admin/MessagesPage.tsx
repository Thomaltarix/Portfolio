import { ContactMessagesTable } from '@/features/admin/components/ContactMessagesTable';

export function MessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Messages</h1>
      <ContactMessagesTable />
    </div>
  );
}
