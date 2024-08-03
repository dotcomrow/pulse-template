import { Fragment } from "react";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import AddNewPayment from "@component/payment-method/AddNewPayment";
import PaymentMethodList from "@component/payment-method/PaymentMethodList";

const AddressList = () => {
  return (
    <Fragment>
      <DashboardPageHeader
        button={<AddNewPayment />}
        title="Payment Methods"
        iconName="credit-card_filled"
      />

      <PaymentMethodList methodList={methodList} />
    </Fragment>
  );
};

const methodList = [
  {
    orderNo: "1050017AS",
    exp: "08 / 2022",
    payment_method: "Amex",
    card_no: "1234 **** **** ****",
  },
  {
    orderNo: "1050017AS",
    exp: "10 / 2025",
    payment_method: "Mastercard",
    card_no: "1234 **** **** ****",
  },
  {
    orderNo: "1050017AS",
    exp: "N/A",
    payment_method: "PayPal",
    card_no: "ui-lib@email.com",
  },
  {
    orderNo: "1050017AS",
    exp: "08 / 2022",
    payment_method: "Visa",
    card_no: "1234 **** **** ****",
  },
];

export default AddressList;
