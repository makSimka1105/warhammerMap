import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

const READ_METHODS = ['GET', 'HEAD', 'OPTIONS'];

interface Session {
    user?: { role?: string };
}

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        if (READ_METHODS.includes(req.method)) return true;

        const cookie = req.headers.cookie;
        if (!cookie) throw new UnauthorizedException();

        const session = await this.fetchSession(cookie);
        if (!session?.user) throw new UnauthorizedException();
        if (session.user.role !== 'ADMIN') throw new ForbiddenException();
        return true;
    }

    private async fetchSession(cookie: string): Promise<Session | null> {
        try {
            const res = await fetch(`${process.env.FRONT_URL}/api/auth/get-session`, {
                headers: { cookie },
                signal: AbortSignal.timeout(5000),
            });
            return res.ok ? await res.json() : null;
        } catch {
            return null;
        }
    }
}
