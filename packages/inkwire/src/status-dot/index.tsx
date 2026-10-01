import { cn } from "../lib/cn";

export type Status = "online" | "degraded" | "offline" | "maintenance";

export interface StatusDotProps {
  status?: Status;
  /** Optional text next to the dot. Defaults to nothing. */
  label?: string;
  /** Pulse ring around the dot. Defaults on for online/degraded. */
  pulse?: boolean;
  size?: number;
  className?: string;
}

const colors: Record<Status, string> = {
  online: "#22c55e",
  degraded: "#f59e0b",
  offline: "#ef4444",
  maintenance: "#3b82f6",
};

/** A live-status indicator with a ping ring, for servers, VMs, services. */
export function StatusDot({ status = "online", label, pulse, size = 10, className }: StatusDotProps) {
  const color = colors[status];
  const pulsing = pulse ?? (status === "online" || status === "degraded");
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)} role="status">
      <span className="relative inline-flex" style={{ width: size, height: size }}>
        {pulsing && <span className="iw-ping absolute inset-0 rounded-full" style={{ background: color }} />}
        <span className="relative inline-flex h-full w-full rounded-full" style={{ background: color }} />
      </span>
      {label ? <span>{label}</span> : <span className="sr-only">{status}</span>}
    </span>
  );
}
