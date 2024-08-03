import { LayoutProps } from "interfaces";
import CustomerDashboardLayout from "@component/layout/customer-dashboard";

export default function MarketLayout({ children }: LayoutProps) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>;
}
