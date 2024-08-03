import { Fragment } from "react";
import api from "@utils/__api__/dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import DashboardContent from "@component/vendor/dashboard/DashboardContent";

const VendorDashboard = async () => {
  const sales = await api.getSales();
  const summeryCards = await api.getSummeryCards();
  const countrySales = await api.getCountryBasedSales();

  return (
    <Fragment>
      <DashboardPageHeader title="Dashboard" iconName="bag_filled" />

      <DashboardContent
        sales={sales}
        summeryCards={summeryCards}
        countrySales={countrySales}
      />
    </Fragment>
  );
};

// VendorDashboard.layout = VendorDashboardLayout;

export default VendorDashboard;
