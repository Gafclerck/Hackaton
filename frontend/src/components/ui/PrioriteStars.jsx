import { FiStar } from "react-icons/fi";

export default function PrioriteStars({ priorite = 1 }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          size={10}
          className={i <= priorite ? "text-warning fill-warning" : "text-border"}
        />
      ))}
    </div>
  );
}
