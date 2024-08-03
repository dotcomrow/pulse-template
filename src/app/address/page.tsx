import Link from "next/link";
import { Fragment } from "react";
import Icon from "@component/icon/Icon";
import api from "@utils/__api__/address";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Pagination from "@component/pagination";
import Typography from "@component/Typography";
import { IconButton } from "@component/buttons";
import AddNewAddress from "@sections/address/AddNewAddress";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import AddressPagination from "@sections/address/AddressPagination";
import AddressItem from "@sections/address/AddressItem";

const AddressList = async () => {
  const addressList = await api.getAddressList();

  return (
    <Fragment>
      <DashboardPageHeader
        title="My Addresses"
        iconName="pin_filled"
        button={<AddNewAddress />}
      />

      {addressList.map((item) => (
        <AddressItem item={item} />
      ))}

      <AddressPagination addressList={addressList} />
    </Fragment>
  );
};

export default AddressList;
