export {};

declare global {
  interface Window {
    // Humne 'any' ki jagah Razorpay ka aup-to-date structure bataya hai
    Razorpay: new (options: any) => {
      open(): void;
    };
  }
}
