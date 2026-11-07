export default function SectionHeading({ eyebrow, title, description, align = 'left', light = false, id }) {
  return (
    <div className={`section-heading section-heading--${align}${light ? ' section-heading--light' : ''}`} data-reveal>
      {eyebrow && <p className="eyebrow"><span aria-hidden="true" />{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {description && <p className="section-heading__description">{description}</p>}
    </div>
  );
}
