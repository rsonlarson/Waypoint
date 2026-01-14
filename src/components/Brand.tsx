export function Brand({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Waypoint"
        style={{ height: size }}
        className="w-auto object-contain"
      />
      {showText && (
        <span className="text-2xl font-bold leading-none">
          Waypoint
        </span>
      )}
    </div>
  );
}
