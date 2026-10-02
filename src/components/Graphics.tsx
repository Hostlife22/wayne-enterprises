interface BikeDrawingProps {
  technical?: boolean;
  variant?: number;
}

export function BikeDrawing({
  technical = false,
  variant = 0,
}: BikeDrawingProps) {
  return (
    <svg
      viewBox="0 0 300 125"
      fill="none"
      aria-hidden="true"
      className={technical ? "technical-bike" : "bike-thumbnail"}
    >
      <g
        stroke="currentColor"
        strokeWidth={technical ? 0.8 : 2}
        fill={technical ? "none" : "#354047"}
      >
        {[60, 243].map((x) => (
          <g key={x}>
            <circle
              cx={x}
              cy="82"
              r="35"
              fill={technical ? "none" : "#1c2428"}
            />
            <circle cx={x} cy="82" r="22" />
            <circle cx={x} cy="82" r="9" />
            {Array.from({ length: 8 }, (_, i) => (
              <path
                key={i}
                d={`M ${x + Math.cos((i * Math.PI) / 4) * 10} ${82 + Math.sin((i * Math.PI) / 4) * 10} L ${x + Math.cos((i * Math.PI) / 4 + 0.2) * 22} ${82 + Math.sin((i * Math.PI) / 4 + 0.2) * 22}`}
              />
            ))}
          </g>
        ))}
        <path d="M60 82 109 52 166 53 243 82 166 96 101 96Z" />
        <path
          d={`M105 62 124 ${28 - variant * 2} 172 32 195 58 178 83 122 81Z`}
          fill={technical ? "none" : variant === 2 ? "#7e8b91" : "#434e55"}
        />
        <path d="M55 40 106 42 115 53 68 50Z M181 29 209 24 213 29 187 35Z M197 31 239 81" />
        <path d="M185 71 235 66 248 84 238 99 181 96Z" />
        <path d="M116 86 166 86M116 91 166 91M116 96 166 96" />
        {technical && (
          <>
            <path d="M24 12H278M24 7V18M278 7V18M14 34V117M9 34H19M9 117H19" />
            <text x="125" y="9" stroke="none" fill="currentColor" fontSize="7">
              2,600 mm
            </text>
            <path d="M30 121H279" />
          </>
        )}
      </g>
    </svg>
  );
}
export function Skyline() {
  return (
    <svg
      viewBox="0 0 300 180"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className="skyline"
    >
      <defs>
        <linearGradient id="sky" x2="0" y2="1">
          <stop stopColor="#74858c" />
          <stop offset="1" stopColor="#152127" />
        </linearGradient>
      </defs>
      <rect width="300" height="180" fill="url(#sky)" />
      {Array.from({ length: 23 }, (_, i) => {
        const h = 28 + ((i * 47) % 110);
        return (
          <g key={i}>
            <path
              d={`M${i * 14} 180V${180 - h}h4v-9h3v-12h2v21h5v${h}Z`}
              fill={i % 3 ? "#172328" : "#304147"}
            />
            {Array.from({ length: 5 }, (_, j) => (
              <path
                key={j}
                d={`M${i * 14 + 5} ${185 - h + j * 14}h2v5h-2Z`}
                fill="#819298"
                opacity=".4"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
