import { createContext, useContext, useState } from "react";
import { theme, ConfigProvider } from "antd";
import zhCN from 'antd/locale/zh_CN';


const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
        colorPrimary: '#2f54eb',
        colorInfo: '#2f54eb',
        colorLinkHover: '#69b1ff',
        colorLinkActive: '#2f54eb',
        colorTextBase: '#000000',
        colorText: "#000000",
        borderRadius: 6,
        wireframe: true,
    },
    components: {
        Layout: {
            headerBg: "#ffffff",
            headerColor: "#fff",
            siderBg: "#f5f5f5",
            bodyBg: "#f5f5f5"
        },
        Menu: {

        }
    }
};

const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: '#d4a040',
        colorInfo: '#d4a040',
        colorLinkHover: '#fa8c16',
        colorLinkActive: '#f5222d',
        colorTextBase: '#FFFFFF',
        colorText: "#ffffff",
        borderRadius: 6,
        wireframe: true,
        colorLink: '#d4a040',
        colorBgContainer: '#1e293b',
        colorBgElevated: "#1e293b",
    },
    components: {
        Layout: {
            headerBg: "#0f172a",
            headerColor: "#fff",
            siderBg: "#0f172a"
        },
        Menu: {
            // colorInfo: '#000040',
            // colorPrimary: '#000040',
        },
        Card: {
            colorBgContainer: "#262626",
            colorBorderSecondary: "rgba(255, 255, 255, 0.1)",
            colorSplit: "rgba(255, 255, 255, 0.1)"
        },
    },
};

export const ThemeContext = createContext(undefined);


const ThemeContextProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const chanageTheme = ()=>{
        setIsDark(prev => !prev);
    }
    return (
        <ThemeContext.Provider value={{ isDark, chanageTheme }}>
            <ConfigProvider
                locale={zhCN}
                theme={isDark ? darkTheme : lightTheme}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within an ThemeContextProvider');
    }
    return context;
};

export default ThemeContextProvider;
