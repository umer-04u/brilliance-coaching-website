export {};

// Hum Razorpay ke options ke liye ek anusaar structure define kar rahe hain
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: {
    name: string;
    email: string;
  };
}

declare global {
  interface Window {
    // Ab humne 'any' ki jagah aup-to-date 'RazorpayOptions' ka istemal kiya hai
    Razorpay: new (options: RazorpayOptions) => {
      open(): void;
    };
  }
}
