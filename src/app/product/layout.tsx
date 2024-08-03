import { LayoutProps } from "interfaces";
import CheckoutNavLayout from "@component/layout/CheckoutNavLayout";

export default function MarketLayout({ children }: LayoutProps) {
  return <CheckoutNavLayout>{children}</CheckoutNavLayout>;
}
