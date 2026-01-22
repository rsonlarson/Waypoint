export function Brand({ size = 40, showText = true, textSize = "text-xl" }: { size?: number; showText?: boolean; textSize?: string }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Waypoint"
        style={{ height: size }}
        className="w-auto object-contain"
      />
      {showText && (
        <span className={`${textSize} font-bold leading-none`}>
          Waypoint
        </span>
      )}
    </div>
  );
}
