export class Admin {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: string = 'admin',
    public readonly createdAt?: Date,
  ) {}
}
