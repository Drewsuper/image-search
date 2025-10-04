import { useState } from "react";
import {
    Layout,
} from "antd";
import SearchComponent from "../components/common/Search";


const { Content } = Layout;


const IndexPage = () => {
    const [image, setImage] = useState(false);
    const [audio, setAudio] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    return (
        <Content style={{
            height: "100%",
            backgroundColor: "#fff",
        }}>
            <SearchComponent image={image} setImage={setImage} audio={audio} setAudio={setAudio} searchValue={searchValue} setSearchValue={setSearchValue} />
        </Content>
    )
};

export default IndexPage;