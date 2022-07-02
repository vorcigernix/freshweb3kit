// deno-lint-ignore-file no-explicit-any
export {};

declare global {
  interface Window {
    ethereum: any;
  }
}