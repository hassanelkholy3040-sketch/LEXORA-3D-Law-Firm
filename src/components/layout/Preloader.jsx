export default function Preloader({ active }) {
  return (
    <div className={`preloader${active ? ' preloader--active' : ' preloader--done'}`} aria-hidden="true">
      <span className="preloader__monogram">L</span>
      <span className="preloader__wordmark">LEXORA</span>
      <span className="preloader__rule" />
    </div>
  );
}
