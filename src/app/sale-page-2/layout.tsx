import { LayoutProps } from "interfaces";
import SaleLayout1 from "@component/layout/SaleLayout1";

export default function MarketLayout({ children }: LayoutProps) {
  return <SaleLayout1>{children}</SaleLayout1>;
}
