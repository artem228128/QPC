export interface Web3RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface Web3Provider {
  request: (args: Web3RequestArguments) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: Web3Provider;
  }
}

export {};
