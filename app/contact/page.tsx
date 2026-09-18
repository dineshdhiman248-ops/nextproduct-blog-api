export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl text-ink mb-10">Contact Us</h1>
      <form className="space-y-4">
        <input className="w-full border rounded-lg px-4 py-2" placeholder="Name" />
        <input className="w-full border rounded-lg px-4 py-2" placeholder="Email" type="email" />
        <textarea className="w-full border rounded-lg px-4 py-2" placeholder="Message" rows={5} />
        <button type="submit" className="btn-primary rounded-full px-8 py-3 font-medium">
          Send Message
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-4">
        Wire this up to your form handler of choice (e.g. a WordPress plugin endpoint, or a
        server action here).
      </p>
    </div>
  );
}
