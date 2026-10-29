const logos = ["Northwind", "Checksum", "Perch & Partners", "Sparrow", "Brightline", "Harbor", "Fieldkit", "Lumen"];

export function LogoMarquee() {
  const doubled = [...logos, ...logos];
  return (
    <section aria-label="Teams using Futurehuman" className="py-10">
      <p className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-white/40">
        Used by people at organizations including
      </p>
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap px-4 text-sm text-white/35">
          {doubled.map((name, i) => (
            <span key={`${name}-${i}`} className="font-medium">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
