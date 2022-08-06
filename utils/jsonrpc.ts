export class JSONRPC {
  private id = 1;

  constructor(
    readonly url: string,
  ) {}

  private async request(method: string, ...params: unknown[]) {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: this.id++,
        method: method,
        params: params,
      }),
    });

    if (!res.ok) throw new Error(res.statusText);
    const { error, result } = await res.json();
    if (error) throw new Error(error.message);
    return result;
  }

  async call(options: {
    from?: string;
    to: string;
    data: string;
  }) {
    return await this.request("eth_call", {
      from: options.from,
      to: options.to,
      data: options.data,
    }, "pending");
  }
}
