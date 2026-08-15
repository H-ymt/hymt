interface TurnstileInstance {
  reset: () => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
}

export {};
