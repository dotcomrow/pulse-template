import { Fragment } from "react";
import { Card1 } from "@component/Card1";
import api from "@utils/__api__/address";
import AddressForm from "@component/address/AddressForm";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import BackToAddress from "@sections/address/BackToAddress";

const AddressDetails = async ({ params }: { params: { id: string } }) => {
  const address = await api.getAddress(String(params.id));

  return (
    <Fragment>
      <DashboardPageHeader
        iconName="pin_filled"
        title="Edit Address"
        button={<BackToAddress />}
      />

      <Card1 borderRadius={8}>
        <AddressForm address={address} />
      </Card1>
    </Fragment>
  );
};

export default AddressDetails;
