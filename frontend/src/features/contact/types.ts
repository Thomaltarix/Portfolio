export interface ContactMessage {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly read: boolean;
  readonly createdAt: string;
}
