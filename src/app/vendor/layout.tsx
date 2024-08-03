import { LayoutProps } from "interfaces";
import VendorDashboardLayout from "@component/layout/vendor-dashboard";

export default function MarketLayout({ children }: LayoutProps) {
  return <VendorDashboardLayout>{children}</VendorDashboardLayout>;
}
