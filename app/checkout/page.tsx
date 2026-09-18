export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-ink mb-6">Checkout</h1>
      <p className="text-sm text-gray-600 mb-8">
        This checkout form should submit to a server action / route that calls the WooCommerce
        Store API's <code>/checkout</code> endpoint (or hands off to the WooCommerce payment
        gateway's redirect flow), so the order and payment are created inside WooCommerce. It is
        intentionally left as a form shell here — wiring the exact payment gateway (Razorpay,
        Stripe, WooCommerce Payments) depends on which plugin is active on your WordPress site.
      </p>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border rounded-lg px-4 py-2" placeholder="First Name" />
        <input className="border rounded-lg px-4 py-2" placeholder="Last Name" />
        <input className="border rounded-lg px-4 py-2 md:col-span-2" placeholder="Email" type="email" />
        <input className="border rounded-lg px-4 py-2 md:col-span-2" placeholder="Phone" />
        <input className="border rounded-lg px-4 py-2 md:col-span-2" placeholder="Address" />
        <input className="border rounded-lg px-4 py-2" placeholder="City" />
        <input className="border rounded-lg px-4 py-2" placeholder="State" />
        <input className="border rounded-lg px-4 py-2" placeholder="Postcode" />
        <input className="border rounded-lg px-4 py-2" placeholder="Country" />
        <button
          type="submit"
          className="md:col-span-2 btn-primary rounded-full px-8 py-3 font-medium mt-2"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
