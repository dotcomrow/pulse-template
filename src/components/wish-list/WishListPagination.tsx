import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";

const WishListPagination = () => {
  return (
    <FlexBox justifyContent="center" mt="2.5rem">
      <Pagination pageCount={5} onChange={(data) => console.log(data)} />
    </FlexBox>
  );
};

export default WishListPagination;
