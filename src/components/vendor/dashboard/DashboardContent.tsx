"use client";
import Card from "@component/Card";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import { currency } from "@utils/utils";
import FlexBox from "@component/FlexBox";
import Typography, { H1, H5, Paragraph } from "@component/Typography";
import VendorAnalyticsChart from "@component/dashboard/VendorAnalyticsChart";

interface Props {
  sales: any;
  summeryCards: any[];
  countrySales: any[];
}
const DashboardContent = (props: Props) => {
  const { sales, summeryCards, countrySales } = props;

  return (
    <>
      <Grid container spacing={6}>
        {summeryCards.map((item, ind) => (
          <Grid item lg={4} md={4} sm={6} xs={12} key={ind}>
            <Typography
              as={Card}
              py="1.5rem"
              height="100%"
              borderRadius={8}
              textAlign="center"
            >
              <H5 color="text.muted" mb="8px">
                {item.title}
              </H5>

              <H1 color="gray.700" mb="4px" lineHeight="1.3">
                {item.amount}
              </H1>

              <Paragraph color="text.muted">{item.subtitle}</Paragraph>
            </Typography>
          </Grid>
        ))}

        <Grid item lg={8} xs={12}>
          <Card p="20px 30px" borderRadius={8}>
            <H5 mb="1.5rem">Sales</H5>
            <VendorAnalyticsChart sales={sales} />
          </Card>
        </Grid>

        <Grid item lg={4} xs={12}>
          <Card p="20px 30px" borderRadius={8}>
            <H5>Top Countries</H5>
            {countrySales.map((item, ind) => (
              <FlexBox
                alignItems="center"
                justifyContent="space-between"
                my="1rem"
                key={ind}
              >
                <FlexBox alignItems="center">
                  <Avatar src={item.flagUrl} size={30} mr="8px" />
                  <span>{item.name}</span>
                </FlexBox>
                <H5>{currency(item.amount)}</H5>
              </FlexBox>
            ))}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardContent;
