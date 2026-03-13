import { cn } from "@/lib/utils";

export function ConsistencyCalendar({
  data,
}: {
  data: Array<{ day: string; workout: number; nutrition: number; checkIn: number }>;
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {data.map((d) => {
        const level = d.workout + d.nutrition + d.checkIn;
        return (
          <div key={d.day} className="text-center">
            <div
              className={cn(
                "mx-auto h-8 w-8 rounded-md",
                level === 0
                  ? "bg-white/5"
                  : level === 1
                    ? "bg-cyan-500/30"
                    : level === 2
                      ? "bg-cyan-400/50"
                      : "bg-cyan-300/80",
              )}
            />
            <p className="mt-1 text-[10px] text-zinc-400">{d.day}</p>
          </div>
        );
      })}
    </div>
  );
}
