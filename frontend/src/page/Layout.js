import {
    FloatButton,
    Layout,
    Tooltip
} from "antd";
import HeaderPage from "../components/layout/Header";
import { Outlet } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { MoonIcon, SunIcon } from "../components/icon/icon";

const { Content } = Layout;
const LayoutPage = () => {

    const { isDark, chanageTheme } = useTheme();

    return (
        <Layout style={{ height: "100vh", width: "100vw" }}>
            {/* <HeaderPage /> */}
            <Content style={{ width: "100vw", height: "80vh" }}>
                <Outlet />
            </Content>
            {/* <FloatButton.Group>
                <Tooltip
                    title={isDark ? "亮色" : "暗色"}
                >
                    <FloatButton icon={isDark ? <SunIcon/> : <MoonIcon />} onClick={()=>chanageTheme()}/>
                </Tooltip>
            </FloatButton.Group> */}
        </Layout>
    );
};
export default LayoutPage;