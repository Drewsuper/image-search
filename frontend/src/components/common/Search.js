import { Suspense, useState } from "react";
import {
    Layout,
    Button,
    Upload,
    Flex,
    Row,
    message,
    Tooltip
} from "antd";
import { AudioOutlined, SearchOutlined, InboxOutlined } from "@ant-design/icons";
import { ImageIcon } from "../icon/icon";
import { useNavigate } from "react-router-dom";


const { Content } = Layout;
const { Dragger } = Upload;


const SearchComponent = ({
    image,
    setImage,
    audio,
    setAudio,
    searchValue,
    setSearchValue
}) => {
    const navigate = useNavigate();

    const SearchButton = (
        <Flex
            style={{
                backgroundColor: "#fff",
                borderLeft: "none",
                height: "100%",
                alignItems: "center"
            }}
            gap={10}
        >
            <Tooltip title={"图片搜索"}>
                <Button
                    type="text"
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "4px",
                        padding: 0,
                        margin: 0
                    }}
                    icon={<ImageIcon style={{ fontSize: "20px" }} />}
                    onClick={() => setImage(prev => !prev)} />
            </Tooltip>
            <Tooltip title={"语音搜索"}>
                <Button
                    type="text"
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "4px",
                        padding: 0,
                        margin: 0
                    }}
                    icon={<AudioOutlined style={{ fontSize: "20px" }} />}
                    onClick={() => setAudio(prev => !prev)} />
            </Tooltip>
        </Flex>
    );


    const draggerProps = {
        name: 'file',
        multiple: false,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        accept: ".png,.jpg,",
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            console.log("搜索内容:", searchValue);
            navigate(`/search?s=${searchValue}`);
        }
    };

    return (
        <Suspense>
            <Row
                justify={"center"}
                style={{
                    marginBottom: '3vh'
                }}
            >
                <form
                    onSubmit={handleSearch}
                    style={{
                        width: "40vw",
                        maxWidth: "100%",
                        marginTop: "30vh",
                        height: '7vh'
                    }}
                >
                    <div className="google-search-container" style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        height: "7vh",
                        borderRadius: "27px",
                        overflow: "hidden",
                        boxShadow: "0 1px 6px rgba(32,33,36,0.15)",
                        border: "1px solid #dfe1e5",
                        background: "#fff"
                    }}>
                        <div className="search-icon" style={{
                            position: "absolute",
                            left: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9aa0a6"
                        }}>
                            <SearchOutlined style={{ fontSize: "20px" }} />
                        </div>
                        <input
                            id="search-input"
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="搜索"
                            className="google-search-input"
                            style={{
                                width: "100%",
                                height: "100%",
                                paddingLeft: "45px",
                                paddingRight: "45px",
                                borderRadius: "27px",
                                border: "none",
                                outline: "none",
                                transition: "all 0.3s",
                                fontSize: "20px"
                            }}
                        />

                        {/* 右侧按钮区域 */}
                        <div className="search-buttons" style={{
                            position: "absolute",
                            right: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}>
                            {SearchButton}
                        </div>
                    </div>
                </form>
            </Row>
            <Row
                justify={"center"}
                style={{
                    width: "100%"
                }}
            >
                <Row
                    justify={"center"}
                >
                    {image && (
                        <Dragger {...draggerProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                            <p className="ant-upload-hint">
                                禁止上传公司数据或其他违禁文件。
                            </p>
                        </Dragger>
                    )}
                </Row>
                <Row
                    justify={"center"}
                >
                    {audio && (
                        <Dragger {...draggerProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                            <p className="ant-upload-hint">
                                禁止上传公司数据或其他违禁文件。
                            </p>
                        </Dragger>
                    )}
                </Row>
            </Row>
        </Suspense>
    )
};

export default SearchComponent;
