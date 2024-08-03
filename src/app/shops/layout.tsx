import { LayoutProps } from "interfaces";
import NavbarLayout from "@component/layout/NavbarLayout";

export default function MarketLayout({ children }: LayoutProps) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
