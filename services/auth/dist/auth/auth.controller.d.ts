import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    register(body: {
        email: string;
        username: string;
        password: string;
    }): Promise<import("./user.entity").User>;
}
