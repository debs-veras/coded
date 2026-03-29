import clsx from "clsx";
import React, { forwardRef, type ReactNode } from "react";

type Props = {
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  loading?: boolean;
  disabled?: boolean;
  type?: "error" | "success" | "default" | "warning" | "print" | "info";
  text?: string | ReactNode;
  icon?: ReactNode;
  className?: string;
  classNameText?: string;
  children?: ReactNode | Array<ReactNode> | string;
  model: "button" | "submit" | "reset";
};

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    id,
    onClick,
    loading = false,
    disabled = false,
    type,
    text,
    icon,
    className = "",
    classNameText = "",
    children,
    model = "button",
  } = props;

  return (
    <button
      ref={ref}
      id={id}
      type={model}
      onClick={onClick}
      className={clsx(
        "relative cursor-pointer flex flex-row gap-2 items-center text-sm font-medium rounded-md disabled:cursor-not-allowed",
        loading && "grayscale-50 cursor-not-allowed ",
        type == "success" &&
          "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white",
        type == "error" &&
          "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
        type == "default" &&
          "background-secondary py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 whitespace-nowrap text-sm sm:text-base",
        type == "warning" &&
          "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white",
        type == "print" &&
          "bg-gray-600 hover:bg-gray-500 focus:ring-gray-500 text-white",
        type == "info" &&
          "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
        type != null && "px-4 py-2 shadow-sm",
        className,
      )}
      disabled={loading || disabled}
    >
      <div className="w-full flex gap-2 items-center justify-center">
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}

        {!!text && <span className={clsx(classNameText)}>{text}</span>}
        {children}
      </div>
    </button>
  );
});

export default Button;
