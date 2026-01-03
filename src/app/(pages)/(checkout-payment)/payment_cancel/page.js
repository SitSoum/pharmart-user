// app/payment/cancel/page.jsx
export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Canceled</h1>
      <p className="text-lg mb-6">
        Your payment was canceled. You can try again anytime.
      </p>

      <a
        href="/"
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Return Home
      </a>
    </div>
  );
}
