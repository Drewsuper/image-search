import {
    Typography,
    Layout,
    Skeleton,
    Card,
    Empty,
    Pagination,
    Image,
    Flex
} from "antd";
import { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchComponent from "../components/common/Search";
import { getRandomTip } from "../components/common/TipMessage";

const { Paragraph } = Typography;
const { Content } = Layout;

const ResultPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchParam] = useSearchParams();
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setDataCount] = useState(0);
    const [image, setImage] = useState(false);
    const [audio, setAudio] = useState(false);
    const [query, setQuery] = useState();


    useEffect(() => {
        setQuery(searchParam.get("s") || "");
        setResults([...[...Array(10)].map((_, index) => { return { id: index + 1, imageUrl: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" } })])
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const getPageData = async (page, pagesize) => {
        const res = await fetch.post("", JSON.stringify({ page: page, pagesize: pagesize }));
        return res
    };

    const handlePageChange = async (page, pageSize) => {
        let res
        if (pageSize === currentPage) {
            res = await getPageData(page, pageSize);
        } else {
            setCurrentPageSize(pageSize);
            setCurrentPage(1);
            res = await getPageData(1, pageSize);
        }
        if (res.data.code === 200) {
            setResults(res.data.data.data);
            setDataCount(res.data.data.count);
        } else {
            setResults([]);
            setDataCount(0);
        }
    };

    const SkeletonItem = () => {
        return (
            <Card
                style={{
                    boxShadow: "none",
                    transition: "all 0.3s"
                }}
                hoverable
                cover={
                    <Skeleton.Image
                        active
                        style={{
                            width: "15vw",
                            minHeight: " 30vh",
                            maxHeight: "40vh",
                            objectFit: "cover",
                        }}
                    />
                }
            >
                <Paragraph
                    style={{ color: "#4d515e", fontSize: "14px" }}
                >
                    {getRandomTip()}
                </Paragraph>
            </Card>
        )
    };

    return (
        <Content
            style={{
                padding: "2vh 2vw 5vh 2vw"
            }}>
            <Helmet>
                <title>
                    {`${query}搜索结果`}
                </title>
            </Helmet>
            <div>
                <SearchComponent
                    image={image}
                    setImage={setImage}
                    audio={audio}
                    setAudio={setAudio}
                    searchValue={query}
                    setSearchValue={setQuery}
                    style={{
                        container: {
                            width: "40vw",
                            marginTop: "0",
                            height: "5vh"
                        },
                        searchContainer: {
                            height: "5vh",
                            borderRadius: "20px"
                        },
                        searchInput: {
                            paddingLeft: "40px",
                            fontSize: "14px"
                        },
                        buttonSize: "28px",
                        iconSize: "16px",
                        iconLeft: "12px",
                        buttonRight: "12px",
                        rowJustify: "start",
                        rowMarginBottom: "0",
                    }}
                />
                <div style={{ marginTop: '2vh' }}>
                    <h1 style={{ fontSize: "24px", margin: 0 }}>
                        "{query}" 的搜索结果
                    </h1>
                    <div style={{ color: "#666", marginTop: "1vh" }}>
                        共找到约 {results.length} 条结果（{isLoading ? '加载中...' : '已加载'})
                    </div>
                </div>
                <div
                    style={{
                        marginTop: "4vh",
                        padding: '0 4vw'
                    }}
                >
                    {isLoading ? (
                        <Flex
                            gap={"3vw"}
                            wrap
                            style={{
                                maxWidth: '100%'
                            }}
                        >
                            {
                                [...Array(currentPageSize)].map((_, index) => (
                                    <SkeletonItem key={`skeletion-${index}`} />
                                ))
                            }
                        </Flex>
                    ) : results.length === 0 ? (
                        <Empty
                            description={`没有找到与 "${query}" 相关的结果`}
                            style={{ padding: "40px 0" }}
                        >
                        </Empty>
                    ) : (
                        <Flex
                            wrap
                            gap={"3vw"}
                            style={{
                                maxWidth: "100%"
                            }}
                        >
                            {
                                results.map(item => (
                                    <Card
                                        bordered={false}
                                        style={{
                                            boxShadow: "none",
                                            transition: "all 0.3s"
                                        }}
                                        hoverable
                                        cover={
                                            item.imageUrl && <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                loading="lazy"
                                                style={{
                                                    width: "15vw",
                                                    minHeight: " 30vh",
                                                    maxHeight: "40vh",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        }
                                    >
                                        <Paragraph
                                            style={{ color: "#4d515e", fontSize: "14px" }}
                                        >
                                            {item.description}
                                        </Paragraph>
                                    </Card>
                                )
                                )
                            }
                        </Flex>
                    )}
                </div>
                <Pagination
                    style={{ fontSize: "18px" }}
                    align="center"
                    total={count}
                    current={currentPage}
                    pageSize={currentPageSize}
                    pageSizeOptions={[
                        10, 20, 30, 50
                    ]}
                    showTotal={(total, range) => `共${total}条数据，当前${range[0]} - ${range[1]}`}
                    hideOnSinglePage
                    onChange={handlePageChange}
                />
            </div>
        </Content>
    );
};

export default ResultPage;