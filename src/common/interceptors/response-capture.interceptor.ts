import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResponseCaptureInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest() as any;
    const res = http.getResponse() as any;
    const start = Date.now();

    return next.handle().pipe(
      tap((responseBody) => {
        // Não capturar GET requests
        if (req.method === 'GET') {
          return;
        }
        
        try {
          const baseDir = path.resolve(process.cwd(), 'captured', 'back');
          fs.mkdirSync(baseDir, { recursive: true });
          const safePath = (req && req.path) ? req.path.replace(/\//g, '_').replace(/^_/, '') : 'unknown';
          const filename = `${Date.now()}-${req.method}-${safePath}-${Math.random().toString(36).slice(2, 8)}.json`;
          const filePath = path.join(baseDir, filename);

          const payload = {
            timestamp: new Date().toISOString(),
            method: req && req.method,
            path: req && req.path,
            statusCode: res && res.statusCode ? res.statusCode : null,
            durationMs: Date.now() - start,
            response: responseBody,
          };

          try {
            fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
            // eslint-disable-next-line no-console
            console.log(`[response-capture] saved ${filePath}`);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[response-capture] write error', err);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[response-capture] error', err);
        }
      }),
    );
  }
}
