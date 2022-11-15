export interface Link {
  href: string;
  target?: string;
  value?: any;
  params?: {
    [key: string]: any;
  };
}
