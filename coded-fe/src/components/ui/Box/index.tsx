import clsx from "clsx";
import Loading from "../../Loading";
import { type ReactNode } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {
  className?: string;
  children?: React.ReactNode;
  horizontal?: boolean;
};

type PropsHeader = {
  className?: string;
  children?: React.ReactNode;
};

type PropsBox = {
  className?: string;
  children?: React.ReactNode;
  horizontal?: boolean;
  style?: React.CSSProperties;
  loading?: boolean;
};

export const BoxContainer = ({ children, className, horizontal }: Props) => {
  const [autoAnimateRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <div
      ref={autoAnimateRef}
      className={clsx("flex gap-4", !horizontal && "flex-col", className)}
    >
      {children}
    </div>
  );
};
export default function Box(props: PropsBox): ReactNode {
  const { className, children, horizontal, style, loading } = props;

  return (
    <div
      className={clsx(
        "bg-background bg-white dark:bg-gray-800 p-4 flex rounded-lg gap-y-2 shadow-md",
        !horizontal && "flex-col",
        className,
      )}
      style={style}
    >
      {!loading ? children : <Loading />}
    </div>
  );
}

const Header = (props: PropsHeader): ReactNode => {
  const { children } = props;

  return (
    <div
      className={clsx("flex w-full justify-between items-center col-span-full")}
    >
      {children}
    </div>
  );
};

type PropsContent = {
  children: React.ReactNode | string | string;
  flexDirection?: "flex-row" | "flex-col";
  className?: string;
};

const Content = ({
  children,
  flexDirection = "flex-row",
  className,
}: PropsContent) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 items-start",
        flexDirection,
        className,
      )}
    >
      {children}
    </div>
  );
};

Content.Titulo = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      id="applicant-information-title"
      className={clsx(
        "text-lg leading-6 font-medium text-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
};

Content.Subtitulo = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={clsx(
        "max-w-2xl font-normal text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
};

Header.Botoes = ({ children }: { children: React.ReactNode | string }) => {
  return <div className="flex justify-end gap-4">{children}</div>;
};

Header.Content = Content;
Box.Header = Header;
