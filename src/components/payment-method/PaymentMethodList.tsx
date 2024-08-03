"use client";
import { useRouter } from "next/navigation";
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Pagination from "@component/pagination";
import Typography, { H5 } from "@component/Typography";
import { IconButton } from "@component/buttons";

interface Props {
  methodList: {
    orderNo: string;
    exp: string;
    payment_method: string;
    card_no: string;
  }[];
}

const PaymentMethodList = ({ methodList }: Props) => {
  const router = useRouter();
  return (
    <>
      {methodList.map((item, ind) => (
        <TableRow key={ind} my="1rem" padding="6px 18px">
          <FlexBox alignItems="center" m="6px">
            <Card width="42px" height="28px" mr="10px" elevation={4}>
              <img
                width="100%"
                alt={item.payment_method}
                src={`/assets/images/payment-methods/${item.payment_method}.svg`}
              />
            </Card>

            <H5 className="pre" m="6px">
              Ralf Edward
            </H5>
          </FlexBox>

          <Typography className="pre" m="6px">
            {item.card_no}
          </Typography>

          <Typography className="pre" m="6px">
            {item.exp}
          </Typography>

          <Typography className="pre" textAlign="center" color="text.muted">
            <IconButton
              onClick={() => router.push("/payment-methods/xkssThds6h37sd")}
            >
              <Icon variant="small" defaultcolor="currentColor">
                edit
              </Icon>
            </IconButton>

            <IconButton onClick={(e) => e.stopPropagation()}>
              <Icon variant="small" defaultcolor="currentColor">
                delete
              </Icon>
            </IconButton>
          </Typography>
        </TableRow>
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={5} onChange={(data) => console.log(data)} />
      </FlexBox>
    </>
  );
};

export default PaymentMethodList;
