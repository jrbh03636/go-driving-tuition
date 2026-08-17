/**
 * GO Driving Tuition logo, recreated as a sharp SVG from the supplied
 * brand artwork: white slab-serif "go" inside a green brush-stroke
 * circle with an open gap at the right, on a black plate with a
 * clipped corner, "driving tuition" beneath.
 *
 * `showBadge` renders the black plate + strapline; the bare mark is
 * used at small sizes (nav / footer).
 */

interface GoLogoProps {
  className?: string;
  showBadge?: boolean;
  /** id prefix so multiple instances don't collide */
  idPrefix?: string;
}

export default function GoLogo({ className, showBadge = true, idPrefix = "logo" }: GoLogoProps) {
  // Green ring: centred at (200,168), r=118, with an open gap on the
  // right-hand side (roughly 2 o'clock to 4 o'clock), rounded ends.
  const cx = 200;
  const cy = 168;
  const r = 118;
  const startAngle = (-52 * Math.PI) / 180; // upper end of the gap
  const endAngle = (24 * Math.PI) / 180; // lower end of the gap
  const sx = cx + r * Math.cos(startAngle);
  const sy = cy + r * Math.sin(startAngle);
  const ex = cx + r * Math.cos(endAngle);
  const ey = cy + r * Math.sin(endAngle);

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="GO Driving Tuition"
      xmlns="http://www.w3.org/2000/svg"
      id={`${idPrefix}-svg`}
    >
      {showBadge && (
        /* Black plate with clipped bottom-right corner */
        <path d="M8 0 H392 V330 L330 400 H8 Z" fill="#0b0d0c" />
      )}

      {/* Green open ring, drawn anticlockwise so the gap sits on the right */}
      <path
        d={`M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 1 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`}
        fill="none"
        stroke="#8dc63f"
        strokeWidth="21"
        strokeLinecap="round"
      />

      {/* White slab-serif wordmark */}
      <text
        x="200"
        y="216"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="Rockwell, 'Roboto Slab', Georgia, 'Times New Roman', serif"
        fontSize="150"
        fontWeight="700"
      >
        go
      </text>

      {showBadge && (
        <text
          x="200"
          y="345"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Rockwell, 'Roboto Slab', Georgia, 'Times New Roman', serif"
          fontSize="42"
          fontWeight="500"
        >
          driving tuition
        </text>
      )}
    </svg>
  );
}
