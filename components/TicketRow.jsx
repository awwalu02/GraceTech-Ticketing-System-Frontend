"use client";

import { STATUS_STYLES } from "@/data/tickets";
import { getCategory } from "@/data/categories";
import { formatDateTime } from "@/lib/formatDate";

// A ticket row is now purely informational — category icon, title/comment,
// status, and a trailing time/closedOn. Clicking anywhere on it opens the
// detail modal (onOpen), where the "Mark Done" action actually lives.
export default function TicketRow({
  id,
  category,
  comment,
  status,
  time,
  closedOn,
  onOpen,
}) {
  const s = STATUS_STYLES[status];
  const cat = getCategory(category);
  const CategoryIcon = cat.icon;

  return (
    <div
      onClick={onOpen ? () => onOpen(id) : undefined}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-50/40 hover:bg-red-50/70 transition-colors ${
        onOpen ? "cursor-pointer" : ""
      }`}
    >
      {/* Category icon */}
      <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
        <CategoryIcon size={19} className="text-red-600" strokeWidth={2} />
      </div>

      {/* Category label + comment */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-red-600 truncate">
          {cat.label}
        </p>
        <p className="text-xs text-gray-400 truncate">{comment}</p>
      </div>

      {/* Status */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0 w-28">
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
      </div>

      {/* Trailing meta */}
      <div className="shrink-0 w-28 text-right">
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {closedOn ? `Closed ${formatDateTime(closedOn)}` : formatDateTime(time)}
        </span>
      </div>
    </div>
  );
}
