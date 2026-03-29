export type MenuItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
  roles?: string[];
  subItems?: Array<{
    label: string;
    path: string;
    roles?: string[];
  }>;
};
