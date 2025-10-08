import { useState } from "react";
import {
    Layout,
    Space,
    Typography,
    Image
} from "antd";
import SearchComponent from "../components/common/Search";
import { Helmet } from "react-helmet";
import logo from "../static/logo.png";
import gitPng from "../static/giphy.gif"

const { Content } = Layout;
const { Title } = Typography;

const IndexPage = () => {
    const [image, setImage] = useState(false);
    const [audio, setAudio] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [imageSrc, setImageSrc] = useState(logo); 

    return (
        <Content style={{
            height: "100vh",
            display: "flex",
            flexDirection: 'column',
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Helmet>
                <title>
                    首页
                </title>
            </Helmet>
            <Space>
                <Image
                    src={imageSrc}
                    alt="logo"
                    preview={false}
                    onClick={()=>setImageSrc(gitPng)}
                    style={{
                        opacity: '0.8',
                        width: "50vw",
                        height: "20vh",
                        objectFit: 'contain',
                        marginBottom: "2vh"
                    }}
                />
            </Space>
            <SearchComponent image={image} setImage={setImage} audio={audio} setAudio={setAudio} searchValue={searchValue} setSearchValue={setSearchValue} />
        </Content>
    )
};

export default IndexPage;