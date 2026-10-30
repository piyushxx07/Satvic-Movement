const regions = [
  { state: "Maharashtra", language: "Marathi", count: "12 videos" },
  { state: "Karnataka", language: "Kannada", count: "9 videos" },
  { state: "Telangana", language: "Telugu", count: "8 videos" },
  { state: "Tamil Nadu", language: "Tamil", count: "11 videos" },
  { state: "Kerala", language: "Malayalam", count: "6 videos" },
  { state: "Gujarat", language: "Gujarati", count: "5 videos" },
  { state: "West Bengal", language: "Bengali", count: "7 videos" },
  { state: "Odisha", language: "Odia", count: "4 videos" },
  { state: "Punjab", language: "Punjabi", count: "3 videos" },
  { state: "Assam", language: "Assamese", count: "2 videos" },
];

export default function StudioHome() {
  return (
    <main className="studio-page">
      <header className="studio-header">
        <a className="studio-brand" href="/home"><span className="studio-mark">s</span> satvic <span>movement</span></a>
        <span className="studio-caption">FOUNDER’S OFFICE · LANGUAGE STUDIO</span>
      </header>

      <section className="studio-main">
        <div className="studio-intro">
          <p className="studio-kicker">YOUR WORKSPACE</p>
          <h1>Video language studio</h1>
          <p className="studio-description">A home for every original video and the voices that carry it further.</p>
        </div>

        <section className="overview-grid" aria-label="Studio overview">
          <article className="overview-card"><span>Source library</span><strong>Hindi videos</strong><small>Originals ready to dub</small></article>
          <article className="overview-card"><span>Languages</span><strong>10 regions</strong><small>Each with its own workspace</small></article>
          <article className="overview-card"><span>Workflow</span><strong>Dub · Review · Publish</strong><small>One clear path for every video</small></article>
        </section>

        <div className="regions-heading"><div><h2>State folders</h2><p>Each folder has a Hindi source and its regional language.</p></div><span className="folder-location">Videos / States</span></div>
        <section className="region-grid" aria-label="State video folders">
          {regions.map(region => (
            <article className="region-card" key={region.state}>
              <div className="region-icon">▱</div>
              <div className="region-copy"><h3>{region.state}</h3><p>Hindi <span>·</span> {region.language}</p></div>
              <span className="region-count">{region.count}</span>
              <span className="region-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </section>
        <footer className="studio-footer">Thoughtfully made to help every story travel further.</footer>
      </section>
    </main>
  );
}
