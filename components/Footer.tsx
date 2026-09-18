export default function Footer() {
  return (
    <footer className="border-t border-line mt-32 bg-ink text-bg">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div>
          <div className="font-display italic text-2xl mb-3">
            {process.env.NEXT_PUBLIC_SITE_NAME || "Store"}
          </div>
          <p className="text-bg/60 leading-relaxed">Built with WP2Next AI Builder.</p>
        </div>
        <div>
          <div className="text-bg/50 mb-3">Shop</div>
          <ul className="space-y-2 text-bg/80">
            <li><a href="/shop" className="hover:text-gold transition-colors">All Products</a></li>
            <li><a href="/cart" className="hover:text-gold transition-colors">Cart</a></li>
          </ul>
        </div>
        <div>
          <div className="text-bg/50 mb-3">Company</div>
          <ul className="space-y-2 text-bg/80">
            <li><a href="/about" className="hover:text-gold transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-gold transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="text-bg/50 mb-3">Newsletter</div>
          <div className="flex border-b border-bg/30 pb-2">
            <input
              placeholder="Your email"
              className="bg-transparent flex-1 outline-none placeholder:text-bg/40 text-bg"
            />
            <button className="text-gold text-sm hover:text-bg transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-bg/10 py-5 text-center text-xs text-bg/50">
        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || "Store"}. All rights reserved.
      </div>
    </footer>
  );
}
