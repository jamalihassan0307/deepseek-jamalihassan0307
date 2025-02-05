declare global {
  interface Window {
    Prism: {
      highlightAll: () => void;
    };
  }
}

export {};
