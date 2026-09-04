/**
 * Renders one or more schema.org objects as <script type="application/ld+json">
 * tags. Server component — safe to drop into any server-rendered page.
 */
export default function JsonLd({
  data,
}: {
  data: object | null | undefined | (object | null | undefined)[];
}) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is object => Boolean(item),
  );

  if (!items.length) return null;

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // JSON.stringify output is safe to embed; escape "<" so a stray
          // "</script>" inside string content can't break out of the tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
