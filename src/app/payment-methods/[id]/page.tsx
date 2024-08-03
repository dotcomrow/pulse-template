import { Fragment } from "react";
import { Card1 } from "@component/Card1";
import DashboardLayout from "@component/layout/customer-dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import BackToMethods from "@component/payment-method/BackToMethods";
import MethodEditForm from "@component/payment-method/MethodEditForm";

const PaymentMethodEditor = ({ params }: { params: { id: string } }) => {
  return (
    <Fragment>
      <DashboardPageHeader
        button={<BackToMethods />}
        iconName="credit-card_filled"
        title={`${params.id === "add" ? "Add New" : "Edit"} Payment Method`}
      />

      <Card1 borderRadius={8}>
        <MethodEditForm />
      </Card1>
    </Fragment>
  );
};

export default PaymentMethodEditor;
