import { getInitials, getAvatarColor } from "../../utils/helpers";

export default function Avatar({ nom, size = 36, className = "" }) {
  const bg = getAvatarColor(nom);
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold shrink-0 select-none text-primary-foreground ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.36,
      }}
    >
      {getInitials(nom)}
    </div>
  );
}
