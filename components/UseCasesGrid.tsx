export default function UseCasesGrid({
  name,
  description,
  items,
  altBg = false,
  hubAnchor = false,
}: {
  name: string;
  description: string;
  items: readonly { title: string; body: string; tags: string }[];
  altBg?: boolean;
  hubAnchor?: boolean;
}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="use-cases">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Use cases</span>
          <h2>{name} data scraping use cases</h2>
          <p>{description}</p>
        </div>
        <div className="usecases-grid">
          {items.map((uc) => (
            <div key={uc.title} className="usecase-card">
              <h3>{uc.title}</h3>
              <p>{uc.body}</p>
              <span className="usecase-sites">{uc.tags}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
