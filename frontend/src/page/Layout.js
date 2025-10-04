import {
    Layout
} from "antd";

import HeaderPage from "../components/layout/Header";
import { Outlet } from "react-router-dom";

const { Content } = Layout;
const LayoutPage = () => {
    return (
        <Layout style={{ height: "100vh", width: "100vw" }}>
            <HeaderPage />
            <Content style={{ width: "100vw", height: "80vh" }}>
                <Outlet />
            </Content>
        </Layout>
    );
};
export default LayoutPage;