import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type ReactNode, createContext, useContext } from "react";
import ScrollArea from "../ScrollArea";
import clsx from "clsx";
import { RxChevronDown, RxFileText } from "react-icons/rx";

/* =======================
   TIPOS
======================= */
export type tamanhoTitulo = "grande" | "normal" | "pequeno";
export type densidadeTipo = "normal" | "compacta";

type PropsTabela = {
  titulo: string;
  tamanhoTitulo?: tamanhoTitulo;
  descricao?: string;
  children: ReactNode[];
  botoes?: ReactNode | boolean | string;
  icone?: ReactNode;
  densidade?: densidadeTipo;
  zebra?: boolean;
};

type PropsHeader = {
  children: Array<ReactNode | boolean>;
};

type PropsColuna = {
  children: ReactNode | string;
  alignText?: string;
  className?: string;
  detalhesOpen?: boolean;
};

type PropsBody = {
  children?: Array<ReactNode>;
};

type PropsLinha = {
  rowId?: string | number;
  isOpen?: boolean;
  onToggle?: () => void;
  children: ReactNode;
};

type ExpandedRowProps = {
  isOpen: boolean;
  colSpan: number;
  children: ReactNode;
};

type LinhaComponent = React.FC<PropsLinha> & {
  Coluna: React.FC<PropsColuna>;
  ExpandedRow: React.FC<ExpandedRowProps>;
};

/* =======================
   CONTEXTO
======================= */
type TabelaContextType = {
  densidade: densidadeTipo;
  zebra: boolean;
};

const TabelaContext = createContext<TabelaContextType>({
  densidade: "normal",
  zebra: true,
});

/* =======================
   TABLE
======================= */
function Table({
  titulo,
  tamanhoTitulo = "grande",
  descricao,
  children,
  botoes,
  icone,
  densidade = "normal",
  zebra = true,
}: PropsTabela): ReactNode {
  return (
    <TabelaContext.Provider value={{ densidade, zebra }}>
      <div className="mx-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-2">
            {icone}
            <h1
              className={clsx(
                "font-semibold text-foreground",
                tamanhoTitulo === "normal"
                  ? "text-lg"
                  : tamanhoTitulo === "pequeno"
                    ? "text-base"
                    : "text-2xl",
              )}
            >
              {titulo}
            </h1>
          </div>
          {descricao && (
            <span className="text-sm text-muted-foreground">{descricao}</span>
          )}
        </div>
        <div className="mt-2 flex flex-col gap-4 lg:mt-0 lg:flex-row">
          {botoes}
        </div>
      </div>
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-background shadow-sm">
              <ScrollArea paddingX="px-1 lg:px-0">
                <table className="min-w-full table divide-y divide-gray-300">
                  {children}
                </table>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </TabelaContext.Provider>
  );
}

/* =======================
   HEADER
======================= */
const Header = ({ children }: PropsHeader): ReactNode => (
  <thead className="bg-muted">
    <tr className="border-b border-border">{children}</tr>
  </thead>
);

const Coluna = ({
  children,
  alignText = "text-left",
  className,
}: PropsColuna): ReactNode => {
  const { densidade } = useContext(TabelaContext);
  return (
    <th
      className={clsx(
        "px-3 text-sm font-semibold text-foreground bg-muted/60",
        alignText,
        densidade === "compacta" ? "py-2" : "py-3.5",
        className,
      )}
    >
      {children}
    </th>
  );
};

/* =======================
   BODY
======================= */
const Body = ({ children }: PropsBody): ReactNode => {
  const [autoAnimateRef] = useAutoAnimate();
  return (
    <tbody ref={autoAnimateRef} className="bg-background">
      {children}
    </tbody>
  );
};

/* =======================
   LINHA
======================= */
const Linha: LinhaComponent = ({ rowId, isOpen, onToggle, children }) => {
  const { zebra } = useContext(TabelaContext);
  return (
    <tr
      onClick={onToggle}
      className={clsx(
        "transition-colors",
        zebra && [
          "odd:bg-gray-100 even:bg-white",
          "dark:odd:bg-gray-900 dark:even:bg-gray-800",
        ],
        [
          "hover:bg-(--color-secondary)/10",
          "dark:hover:bg-(--color-secondary)/20",
        ],
        isOpen && [
          "bg-(--color-secondary)/20",
          "dark:bg-(--color-secondary)/30",
        ],
        rowId && "cursor-pointer",
      )}
    >
      {children}
    </tr>
  );
};

/* =======================
   COLUNA BODY
======================= */
const ColunaBody = ({
  children,
  alignText = "text-left",
  detalhesOpen,
  className = "",
}: PropsColuna) => {
  const { densidade } = useContext(TabelaContext);

  return (
    <td
      className={clsx(
        "max-w-sm truncate px-3 text-sm text-muted-foreground",
        alignText,
        className,
        densidade === "compacta" ? "py-2" : "py-4",
      )}
    >
      <div
        className={clsx(
          detalhesOpen !== undefined && "flex items-center gap-2",
        )}
      >
        {detalhesOpen !== undefined &&
          (detalhesOpen ? (
            <RxFileText className="h-5 w-5 text-destructive" />
          ) : (
            <RxChevronDown className="h-5 w-5 text-primary" />
          ))}
        {children}
      </div>
    </td>
  );
};

/* =======================
   EXPANDED ROW
======================= */
const ExpandedRow = ({ isOpen, colSpan, children }: ExpandedRowProps) => {
  if (!isOpen) return null;

  return (
    <tr>
      <td colSpan={colSpan} className="bg-muted p-4">
        {children}
      </td>
    </tr>
  );
};

/* =======================
   MAPEAMENTO
======================= */
Header.Coluna = Coluna;
Linha.Coluna = ColunaBody;
Body.Linha = Linha;
Linha.ExpandedRow = ExpandedRow;
Table.Header = Header;
Table.Body = Body;

export default Table;
