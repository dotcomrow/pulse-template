"use client";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import OrderRow from "@component/orders/OrderRow";
import Order from "@models/order.model";

type Props = {
  orders: Order[];
};
const OrderList = ({ orders }: Props) => {
  return (
    <>
      {orders.map((item) => (
        <OrderRow order={item} key={item.id} />
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={5} onChange={(data) => console.log(data)} />
      </FlexBox>
    </>
  );
};

export default OrderList;
