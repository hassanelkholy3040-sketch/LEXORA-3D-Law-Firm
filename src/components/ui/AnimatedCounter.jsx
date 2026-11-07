export default function AnimatedCounter({ value, suffix = '', label }) {
  return (
    <div className="stat">
      <span className="stat__number" data-counter-value={value} data-counter-suffix={suffix} aria-label={`${value}${suffix}`}>0{suffix}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}
