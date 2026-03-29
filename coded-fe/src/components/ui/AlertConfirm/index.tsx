import * as AlertDialog from "@radix-ui/react-alert-dialog";
import clsx from "clsx";
import { type ReactNode } from "react";

type AlertType = "success" | "error" | "warning" | "info";

const alertStyles: Record<AlertType, { color: string; confirm: string }> = {
  success: {
    color: "bg-green-600 hover:bg-green-700",
    confirm: "Confirm",
  },
  error: {
    color: "bg-red-600 hover:bg-red-700",
    confirm: "Delete",
  },
  warning: {
    color: "bg-yellow-500 hover:bg-yellow-600",
    confirm: "Continue",
  },
  info: {
    color: "bg-blue-600 hover:bg-blue-700",
    confirm: "OK",
  },
};

interface AlertConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: AlertType;
}

export default function AlertConfirm({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Excluir",
  cancelText = "Cancelar",
  type = "info",
}: AlertConfirmProps) {
  const style = alertStyles[type];
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <AlertDialog.Content className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-2 mb-2">  
              <AlertDialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </AlertDialog.Title>
            </div>
            {description && (
              <AlertDialog.Description className="text-gray-600 dark:text-gray-400 mb-6">
                {description}
              </AlertDialog.Description>
            )}
            <div className="flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  {cancelText}
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={onConfirm}
                  className={clsx(
                    "px-4 py-2 text-white rounded-lg transition-colors cursor-pointer",
                    style.color,
                  )}
                >
                  {confirmText || style.confirm}
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
