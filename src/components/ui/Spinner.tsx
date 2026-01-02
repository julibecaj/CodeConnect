"use client";

type SpinnerProps = {
  size?: number;
};

export function Spinner({ size = 18 }: SpinnerProps) {
  const borderSize = Math.max(2, Math.round(size / 8));
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "999px",
        border: `${borderSize}px solid rgba(255,255,255,0.25)`,
        borderTopColor: "#4fc1ff",
        animation: "cc-spin 0.85s linear infinite",
        verticalAlign: "middle",
      }}
    />
  );
}
