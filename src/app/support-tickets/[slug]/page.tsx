import { Fragment } from "react";
import { format } from "date-fns";
import Box from "@component/Box";
import Avatar from "@component/avatar";
import Divider from "@component/Divider";
import api from "@utils/__api__/ticket";
import FlexBox from "@component/FlexBox";
import { H5, SemiSpan } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import BackToSupport from "@component/support-ticket/BackToSupport";
import MessageSubmit from "@component/support-ticket/MessageSubmit";

const TicketDetails = async ({ params }: { params: { slug: string } }) => {
  const ticket = await api.getTicket(String(params.slug));

  return (
    <Fragment>
      <DashboardPageHeader
        iconName="support"
        title="Support Ticket"
        button={<BackToSupport />}
      />

      {ticket.conversation.map((item: any, ind: number) => (
        <FlexBox mb="30px" key={ind}>
          <Avatar src={item.imgUrl} mr="1rem" />
          <Box>
            <H5 fontWeight="600" mt="0px" mb="0px">
              {item.name}
            </H5>
            <SemiSpan>
              {format(new Date(item.date), "hh:mm:a | dd MMM yyyy")}
            </SemiSpan>
            <Box borderRadius="10px" bg="gray.200" p="1rem" mt="1rem">
              {item.text}
            </Box>
          </Box>
        </FlexBox>
      ))}

      <Divider mb="2rem" bg="gray.300" />

      <MessageSubmit />
    </Fragment>
  );
};

export default TicketDetails;
