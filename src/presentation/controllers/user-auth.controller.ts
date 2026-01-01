import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from '@presentation/dtos/user-auth/register.dto';
import { VerifyEmailDto } from '@presentation/dtos/user-auth/verify-email.dto';
import { ResendCodeDto } from '@presentation/dtos/user-auth/resend-code.dto';
import { UserLoginDto } from '@presentation/dtos/user-auth/user-login.dto';
import { RegisterResponseDto, VerifyResponseDto, AuthResponseDto } from '@presentation/dtos/user-auth/auth-response.dto';
import { RegisterUserUseCase } from '@application/use-cases/user-auth/register-user.use-case';
import { VerifyEmailUseCase } from '@application/use-cases/user-auth/verify-email.use-case';
import { ResendVerificationCodeUseCase } from '@application/use-cases/user-auth/resend-verification-code.use-case';
import { LoginUserUseCase } from '@application/use-cases/user-auth/login-user.use-case';
import { GoogleLoginUseCase } from '@application/use-cases/user-auth/google-login.use-case';
import { GoogleAuthGuard } from '@auth/guards/google-auth.guard';

@ApiTags('User Authentication')
@Controller('auth')
export class UserAuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationCodeUseCase: ResendVerificationCodeUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration', description: 'Register a new user and send verification email' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Registration successful', type: RegisterResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request (passwords do not match)' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.registerUserUseCase.execute(registerDto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email', description: 'Verify user email with verification code' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({ status: 200, description: 'Email verified successfully', type: VerifyResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification code' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<VerifyResponseDto> {
    return this.verifyEmailUseCase.execute(verifyEmailDto);
  }

  @Post('resend-code')
  @ApiOperation({ summary: 'Resend verification code', description: 'Resend email verification code' })
  @ApiBody({ type: ResendCodeDto })
  @ApiResponse({ status: 200, description: 'Verification code resent' })
  @ApiResponse({ status: 400, description: 'Email already verified' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resendCode(@Body() resendCodeDto: ResendCodeDto): Promise<{ message: string }> {
    return this.resendVerificationCodeUseCase.execute(resendCodeDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Login with email and password' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Email not verified' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: UserLoginDto): Promise<AuthResponseDto> {
    return this.loginUserUseCase.execute(loginDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth login', description: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth' })
  async googleAuth() {
    // Guard handles redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback', description: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google login successful', type: AuthResponseDto })
  async googleAuthCallback(@Req() req: any): Promise<AuthResponseDto> {
    const { googleId, email, firstName, lastName } = req.user;
    return this.googleLoginUseCase.execute({ googleId, email, firstName, lastName });
  }
}
