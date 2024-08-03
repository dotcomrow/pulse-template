import { LayoutProps } from "interfaces";
import DashboardLayout from "@component/layout/customer-dashboard";

export default function MarketLayout({ children }: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
