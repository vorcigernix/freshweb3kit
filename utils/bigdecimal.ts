export class BigDecimal {
  constructor(
    readonly value: bigint,
    readonly decimals: number,
  ) {}

  static from(number: number, decimals: number) {
    const [int, decimal] = String(number).split(".");
    const pdecimal = (decimal ?? "").padEnd(decimals, "0");
    return new this(BigInt(int + pdecimal), decimals);
  }

  toString() {
    const string = String(this.value).padStart(this.decimals + 1, "0");
    return string.slice(0, -this.decimals) + "." + string.slice(-this.decimals);
  }

  toNumber() {
    return Number(this.toString());
  }
}
