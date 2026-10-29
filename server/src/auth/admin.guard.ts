import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { REQUIRE_ADMIN } from './admin.decorator';

const READ_METHODS = ['GET', 'HEAD', 'OPTIONS'];

interface Session {
    user?: { role?: string };
}

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const required = this.reflector.getAllAndOverride<boolean>(REQUIRE_ADMIN, [context.getHandler(), context.getClass()]);
        if (READ_METHODS.includes(req.method) && !required) return true;

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
