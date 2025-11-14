import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export function requestCaptureMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    const contentType = req.headers['content-type'] || '';
    const isJson = typeof req.is === 'function' ? req.is('application/json') : contentType.includes('application/json');

    if (methods.includes(req.method) && isJson) {
      const baseDir = path.resolve(process.cwd(), 'captured', 'front');
      fs.mkdirSync(baseDir, { recursive: true });
      const safePath = (req.path || 'root').replace(/\//g, '_').replace(/^_/, '');
      const filename = `${Date.now()}-${req.method}-${safePath}-${Math.random().toString(36).slice(2, 8)}.json`;
      const filePath = path.join(baseDir, filename);

      const payload = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body,
      };

      try {
        fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
        // eslint-disable-next-line no-console
        console.log(`[request-capture] saved ${filePath}`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[request-capture] write error', err);
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[request-capture] error', err);
  }

  next();
}
