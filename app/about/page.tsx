import { getWordPressPage } from "@/lib/wordpress";

export default async function AboutPage() {
  const page = await getWordPressPage("about").catch(() => null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 prose">
      <h1>{page ? page.title.rendered : "About Us"}</h1>
      {page ? (
        <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      ) : (
        <p>Connect a WordPress "About" page to populate this content.</p>
      )}
    </div>
  );
}
