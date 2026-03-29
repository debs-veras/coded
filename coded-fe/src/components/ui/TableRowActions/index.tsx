import { HiPencil, HiTrash, HiBadgeCheck } from "react-icons/hi";
import type { ReactNode } from "react";

type ActionConfig = {
  onClick?: () => void;
  title?: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
};

type Props = {
  actions?: {
    publish?: ActionConfig;
    edit?: ActionConfig;
    delete?: ActionConfig;
  };
  className?: string;
};

export default function TableRowActions({
  actions,
  className = "",
}: Props) {
  const publish = actions?.publish;
  const edit = actions?.edit;
  const remove = actions?.delete;

  return (
    <div className={`flex items-center gap-2 justify-end ${className}`}>
      {publish?.onClick && (
        <button
          type="button"
          onClick={publish.onClick}
          disabled={publish.disabled}
          className={`p-2 rounded-lg transition-colors ${
            publish.className ??
            "text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10"
          } ${publish.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          title={publish.title ?? "Publicar"}
        >
          {publish.icon ?? <HiBadgeCheck className="w-5 h-5" />}
        </button>
      )}
      {edit?.onClick && (
        <button
          type="button"
          onClick={edit.onClick}
          disabled={edit.disabled}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            edit.className ??
            "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
          } ${edit.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          title={edit.title ?? "Editar"}
        >
          {edit.icon ?? <HiPencil className="w-5 h-5" />}
        </button>
      )}
      {remove?.onClick && (
        <button
          type="button"
          onClick={remove.onClick}
          disabled={remove.disabled}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            remove.className ??
            "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
          } ${remove.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          title={remove.title ?? "Excluir"}
        >
          {remove.icon ?? <HiTrash className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
