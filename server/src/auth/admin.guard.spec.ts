import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminGuard } from './admin.guard';
import { RequireAdmin } from './admin.decorator';

class Routes {
    open() {}
    @RequireAdmin()
    protected() {}
}

function contextFor(method: string, cookie?: string, handler = Routes.prototype.open): ExecutionContext {
    const req = { method, headers: cookie ? { cookie } : {} };
    return {
        switchToHttp: () => ({ getRequest: () => req }),
        getHandler: () => handler,
        getClass: () => Routes,
    } as unknown as ExecutionContext;
}

function mockSession(body: unknown, ok = true) {
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok, json: async () => body } as Response);
}

describe('AdminGuard', () => {
    const guard = new AdminGuard(new Reflector());

    beforeEach(() => {
        process.env.FRONT_URL = 'http://front.test';
    });

    afterEach(() => jest.restoreAllMocks());

    it('lets reads through without a session', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch');
        await expect(guard.canActivate(contextFor('GET'))).resolves.toBe(true);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('rejects writes without a cookie', async () => {
        await expect(guard.canActivate(contextFor('POST'))).rejects.toThrow(UnauthorizedException);
    });

    it('rejects an expired session', async () => {
        mockSession(null);
        await expect(guard.canActivate(contextFor('DELETE', 's=1'))).rejects.toThrow(UnauthorizedException);
    });

    it('rejects a non-admin user', async () => {
        mockSession({ user: { role: 'USER' } });
        await expect(guard.canActivate(contextFor('PUT', 's=1'))).rejects.toThrow(ForbiddenException);
    });

    it('treats an unreachable auth server as no session', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('ECONNREFUSED'));
        await expect(guard.canActivate(contextFor('POST', 's=1'))).rejects.toThrow(UnauthorizedException);
    });

    it('lets an admin write and forwards the cookie', async () => {
        mockSession({ user: { role: 'ADMIN' } });
        await expect(guard.canActivate(contextFor('POST', 's=1'))).resolves.toBe(true);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://front.test/api/auth/get-session',
            expect.objectContaining({ headers: { cookie: 's=1' } }),
        );
    });

    it('checks the session on a read marked RequireAdmin', async () => {
        await expect(guard.canActivate(contextFor('GET', undefined, Routes.prototype.protected))).rejects.toThrow(UnauthorizedException);
        mockSession({ user: { role: 'USER' } });
        await expect(guard.canActivate(contextFor('GET', 's=1', Routes.prototype.protected))).rejects.toThrow(ForbiddenException);
        mockSession({ user: { role: 'ADMIN' } });
        await expect(guard.canActivate(contextFor('GET', 's=1', Routes.prototype.protected))).resolves.toBe(true);
    });
});
