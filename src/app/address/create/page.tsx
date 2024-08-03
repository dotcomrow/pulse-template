import { Fragment } from "react";
import { Card1 } from "@component/Card1";
import AddressForm from "@component/address/AddressForm";
import DashboardLayout from "@component/layout/customer-dashboard";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import BackToAddress from "@sections/address/BackToAddress";

const CreateAddress = () => {
  return (
    <Fragment>
      <DashboardPageHeader
        iconName="pin_filled"
        title="Add New Address"
        button={<BackToAddress />}
      />

      <Card1 borderRadius={8}>
        <AddressForm />
      </Card1>
    </Fragment>
  );
};

CreateAddress.layout = DashboardLayout;

export default CreateAddress;
