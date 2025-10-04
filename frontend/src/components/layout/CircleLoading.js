import { Flex, Spin } from "antd"
import { getRandomTip } from "../common/TipMessage"
import { LoadingOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Paragraph } = Typography;

const CricleLoadingPage = ({ style }) => {

    return (
        <Flex
            justify='center'
            align='center'
            style={{ ...style }}
        >
            <Spin
                size="large"
                indicator={
                    <>
                        <LoadingOutlined style={{ fontSize: 100, color: '#1890ff' }} spin />
                        <Paragraph style={{ fontSize: "20", marginTop: 8, color: '#1890ff' }}>
                            {getRandomTip()}
                        </Paragraph>
                    </>
                }
            />
        </Flex>
    )
};


export default CricleLoadingPage;