import React from "react";
import { CurrentUSer } from "./current-user";
import { Layout, Space } from "antd";

const Header = () => {
  const headerStyle: React.CSSProperties = {
    background: "#fff",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 999,
  };
  return (
    <Layout.Header style={headerStyle}>
      <Space align="center" size="middle">
        <CurrentUSer />
      </Space>
    </Layout.Header>
  );
};

export default Header;
