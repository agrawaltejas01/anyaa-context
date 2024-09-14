import { Flex, Spin } from "antd";

const Loader: React.FC = () => {
  return (
    <Flex
      flex={1}
      style={{ height: "100vh", width: "100vw" }}
      justify="center"
      align="center"
    >
      <Spin size="large" />
    </Flex>
  );
};

export default Loader;
