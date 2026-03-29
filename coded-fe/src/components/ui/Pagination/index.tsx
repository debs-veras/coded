import { RxChevronRight, RxChevronLeft } from "react-icons/rx";
import { type ReactNode } from "react";

type Props = {
  page: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  onClickPrevPage: () => void;
  onClickPageNext: () => void;
  onClickPage: (page: number) => void;
  className?: string;
  loading: boolean;
};

export default function PageTable({
  page,
  totalPages,
  totalRecords,
  recordsPerPage,
  onClickPrevPage,
  onClickPageNext,
  onClickPage,
  className,
  loading,
}: Props): ReactNode {
  const currentInitialRecord = totalRecords > 0 ? page * recordsPerPage + 1 : 0;
  const currentFinalRecord =
    (page + 1) * recordsPerPage > totalRecords
      ? totalRecords
      : (page + 1) * recordsPerPage;

  const baseButtonClass =
    "inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40";

  const renderPageButton = (num: number, isActive?: boolean) => (
    <button
      key={num}
      onClick={() => onClickPage(num - 1)}
      disabled={loading || isActive}
      className={`${baseButtonClass} ${
        isActive
          ? "border-(--color-primary) bg-(--color-primary) text-white shadow-sm shadow-primary/20"
          : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-(--color-primary)/50 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-primary"
      }`}
    >
      {num}
    </button>
  );

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between mt-8 p-1.5 gap-4 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 order-2 sm:order-1">
        <p>
          Mostrando <span className="font-bold text-neutral-900 dark:text-white">{currentInitialRecord}</span> até{" "}
          <span className="font-bold text-neutral-900 dark:text-white">{currentFinalRecord}</span> de{" "}
          <span className="font-bold text-neutral-900 dark:text-white">{totalRecords}</span> resultados
        </p>
      </div>

      <nav 
        className="flex items-center gap-1.5 order-1 sm:order-2"
        aria-label="Paginação"
      >
        <button
          onClick={onClickPrevPage}
          disabled={loading || page === 0}
          className={`${baseButtonClass} border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700`}
          aria-label="Página anterior"
        >
          <RxChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {page > 1 && renderPageButton(1)}
          
          {page > 2 && (
            <span className="flex h-9 w-9 items-center justify-center text-neutral-400" key="start-ellipsis">
              ...
            </span>
          )}

          {page > 0 && renderPageButton(page, false)}
          {renderPageButton(page + 1, true)}
          {page + 1 < totalPages && renderPageButton(page + 2, false)}

          {page + 3 < totalPages && (
            <span className="flex h-9 w-9 items-center justify-center text-neutral-400" key="end-ellipsis">
              ...
            </span>
          )}
          
          {page + 2 < totalPages && renderPageButton(totalPages)}
        </div>

        <button
          onClick={onClickPageNext}
          disabled={loading || page + 1 >= totalPages}
          className={`${baseButtonClass} border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700`}
          aria-label="Próxima página"
        >
          <RxChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}
