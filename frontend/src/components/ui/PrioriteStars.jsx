import { Star } from "lucide-react";

export default function PrioriteStars({ priorite = 1 }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          className={i <= priorite ? "text-warning fill-warning" : "text-border"}
        />
      ))}
    </div>
  );
}
