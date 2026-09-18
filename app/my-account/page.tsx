// This scaffold does not implement custom auth — WooCommerce/WordPress
// remains the source of truth for customers, same as orders and payments.
// The simplest correct approach is to link out to the WordPress site's own
// My Account page (created automatically by WooCommerce), or embed it if
// you later add JWT/cookie-based auth against the WordPress REST API.

const WORDPRESS_URL = process.env.WORDPRESS_URL;

export default function MyAccountPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="font-display text-3xl text-ink mb-4">My Account</h1>
      <p className="text-muted mb-8 leading-relaxed">
        Account login and order history are handled by WordPress/WooCommerce — this frontend
        doesn&apos;t keep its own customer database.
      </p>
      {WORDPRESS_URL ? (
        <a
          href={`${WORDPRESS_URL}/my-account`}
          className="btn-primary inline-block rounded-full px-8 py-3.5 font-medium"
        >
          Go to My Account
        </a>
      ) : (
        <p className="text-sm text-red-500">Set WORDPRESS_URL in .env to enable this link.</p>
      )}
    </div>
  );
}
