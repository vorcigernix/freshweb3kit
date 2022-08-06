import * as ethabi from "etabi";
import { JSONRPC } from "./jsonrpc.ts";
import ERC20 from "./abi/ERC20.ts";

export class Token {
	constructor(readonly jsonrpc: JSONRPC, readonly address: string) {}

	private async call<T extends unknown[]>(
		name: string,
		params: unknown[] = []
	): Promise<T> {
		const func = ERC20.function(name)!;
		const input = ethabi.call(func, params);
		const output = await this.jsonrpc.call({ data: input, to: this.address });
		return ethabi.decode(func, output) as T;
	}

	/*   async symbol() {
    const [symbol] = await this.call<[string]>("symbol");
    return symbol;
  }

  async decimals() {
    const [decimals] = await this.call<[number]>("decimals");
    return decimals;
  }

  async totalSupply() {
    const [totalSupply] = await this.call<[bigint]>("totalSupply");
    return totalSupply;
  }

  async balanceOf(address: string) {
    const [balance] = await this.call<[bigint]>("balanceOf", [address]);
    return balance;
  } */

  async description() {
    const [description] = await this.call<[string]>("description");
    return description;
  }
	async latestRoundData() {
		const [price] = await this.call<[bigint]>("latestRoundData");
		return price;
	}
  async decimals() {
    const [decimals] = await this.call<[number]>("decimals");
    return decimals;
  }
}
