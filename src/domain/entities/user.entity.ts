export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly isVerified: boolean = false,
    public readonly googleId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
