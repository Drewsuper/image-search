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


const DEFAULT_STYLES = {
    container: {
        width: "40vw",
        maxWidth: "100%",
        height: '7vh'
    },
    searchContainer: {
        height: "7vh",
        borderRadius: "27px"
    },
    searchInput: {
        paddingLeft: "45px",
        paddingRight: "45px",
        fontSize: "20px"
    },
    dragContainer: {
        width: "100%"
    }
};


const SearchComponent = ({
    image,
    setImage,
    audio,
    setAudio,
    searchValue,
    setSearchValue,
    style = {}
}) => {
    const navigate = useNavigate();

    const mergedStyles = {
        container: { ...DEFAULT_STYLES.container, ...style.container },
        searchContainer: { ...DEFAULT_STYLES.searchContainer, ...style.searchContainer },
        searchInput: { ...DEFAULT_STYLES.searchInput, ...style.searchInput },
        dragContainer: { ...DEFAULT_STYLES.dragContainer, ...style.dragContainer }
    };

    const SearchButton = (
        <Flex
            style={{
                // backgroundColor: "#fff",
                borderLeft: "none",
                height: "100%",
                alignItems: "center",
                ...style.buttonGroup
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
                        margin: 0,
                        ...style.imageButton
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
                        margin: 0,
                        ...style.audioButton
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
                justify={style.rowJustify || "center"}
                style={{
                    marginBottom: style.rowMarginBottom || '3vh',
                    ...style.rowContainer
                }}
            >
                <form
                    onSubmit={handleSearch}
                    style={{
                        ...mergedStyles.container
                    }}
                >
                    <div className="google-search-container" style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        height: "7vh",
                        borderRadius: "27px",
                        overflow: "hidden",
                        ...mergedStyles.searchContainer,
                        boxShadow: "0 1px 6px rgba(32,33,36,0.15)",
                        border: "1px solid #dfe1e5",
                        // background: "#fff",
                        ...style.searchContainer
                    }}>
                        <div className="search-icon" style={{
                            position: "absolute",
                            left: style.iconLeft || "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9aa0a6"
                        }}>
                            <SearchOutlined style={{ fontSize: style.iconSize || "20px" }} />
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
                                ...mergedStyles.searchInput,
                                borderRadius: style.inputRadius || "27px",
                                border: "none",
                                outline: "none",
                                transition: "all 0.3s",
                                ...style.searchInput
                            }}
                        />

                        {/* 右侧按钮区域 */}
                        <div className="search-buttons" style={{
                            position: "absolute",
                            right: style.buttonRight || "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                            gap: style.buttonGap || "10px",
                            ...style.buttonContainer
                        }}>
                            {SearchButton}
                        </div>
                    </div>
                </form>
            </Row>
            <Row
                justify={style.draggerRowJustify || "center"}
                style={{
                    width: "100%",
                    ...style.draggerRowContainer
                }}
            >
                <Row
                    justify={style.draggerInnerRowJustify || "center"}
                    style={style.draggerInnerRow}
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
                    justify={style.audioDraggerRowJustify || "center"}
                    style={style.audioDraggerRow}
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
