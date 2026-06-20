export type RouteType = {
  route: string;
  title?: string;
  filePathTemplates?: string;
  useLayout?: string;
  load(): void;
};
