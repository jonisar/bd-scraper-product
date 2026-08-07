export default function FaqSection({
  title,
  description,
  items,
  altBg = false,
  hubAnchor = false,
}: {
  title: string;
  description: string;
  items: readonly { q: string; a: string }[];
  altBg?: boolean;
  hubAnchor?: boolean;
}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="faq">
      <div className="container">
        <div className="section-head">
          <span className="kicker">FAQs</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
