import { type ReactNode } from "react";
import { HiFolder, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: ReactNode;
  actionIcon?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  icon = <HiFolder className="w-16 h-16 text-gray-400 mx-auto mb-4" />,
  actionIcon = <HiPlus className="w-5 h-5" />,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      {icon}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionIcon}
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
