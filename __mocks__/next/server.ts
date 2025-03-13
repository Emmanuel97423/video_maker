export const NextResponse = {
  json: (body: any, options?: { status?: number }) => ({
    status: options?.status || 200,
    json: () => Promise.resolve(body),
    headers: new Map(),
    ok: (options?.status || 200) < 400
  })
};

export class NextRequest {
  private url: string;
  private method: string;
  private body: any;
  private headers: Headers;

  constructor(url: string, options: { method: string; body?: any; headers?: Record<string, string> }) {
    this.url = url;
    this.method = options.method;
    this.body = options.body;
    this.headers = new Headers(options.headers);
  }

  async json() {
    return Promise.resolve(
      typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    );
  }
} 