import {
    Button,
    Typography,
    Layout,
    Skeleton,
    List,
    Card,
    Empty,
    Pagination
} from "antd";
import { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CricleLoadingPage from "../components/layout/CircleLoading";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Search from "antd/es/transfer/search";
import SearchComponent from "../components/common/Search";

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


    const query = searchParam.get("s") || "";


    useEffect(() => {

        setTimeout(() => {
            setIsLoading(false);
        }, 400);
    }, []);

    const getPageData = async (page,pagesize)=>{
        const res = await fetch.post("",JSON.stringify({page:page,pagesize:pagesize}));
        return res
    }

    const handlePageChange = async (page,pageSize) => {
        let res
        if (pageSize === currentPage) {
            res = await getPageData(page,pageSize);
        }else{
            setCurrentPageSize(pageSize);
            setCurrentPage(1);
            res = await getPageData(1,pageSize);
        }
        if (res.data.code === 200) {
            setResults(res.data.data.data);
            setDataCount(res.data.data.count);
        }else{
            setResults([]);
            setDataCount(0);
        }
    }

    return (
        <Content
            style={{
                height: "100%",
                backgroundColor: "#fff",
            }}>
            <Helmet>
                <title>
                    {`${query}搜索结果`}
                </title>
            </Helmet>
            <div style={{ padding: "0 1vw" }}>
                <div style={{ marginBottom: "20px", width:"50vw", height:"5vh" }}>
                    
                </div>

                <div style={{ marginBottom: "30px" }}>
                    <h1 style={{ fontSize: "24px", margin: 0 }}>
                        "{query}" 的搜索结果
                    </h1>
                    <div style={{ color: "#666", marginTop: "8px" }}>
                        共找到约 {results.length} 条结果（{isLoading ? '加载中...' : '已加载'})
                    </div>
                </div>

                {isLoading ? (
                    <CricleLoadingPage style={{ width: "100%", height: "70vh" }} />
                ) : results.length === 0 ? (
                    <Empty
                        description={`没有找到与 "${query}" 相关的结果`}
                        style={{ padding: "40px 0" }}
                    >
                        <Button type="primary" onClick={() => navigate("/")}>
                            修改搜索词
                        </Button>
                    </Empty>
                ) : (
                    <div>
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={results}
                            renderItem={item => (
                                <List.Item key={item.id} style={{ padding: "16px 0" }}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            boxShadow: "none",
                                            transition: "all 0.3s",
                                            cursor: "pointer"
                                        }}
                                        hoverable
                                    >
                                        <a href={item.url} style={{ color: "#1a0dab", fontSize: "18px", textDecoration: "none" }}>
                                            {item.title}
                                        </a>
                                        <div style={{ color: "#5f6368", fontSize: "14px", marginTop: "4px" }}>
                                            {item.url.replace(/^https?:\/\//, '')}
                                        </div>
                                        <Paragraph
                                            ellipsis={{ rows: 2, expandable: false }}
                                            style={{ color: "#4d515e", marginTop: "8px", fontSize: "14px" }}
                                        >
                                            {item.description}
                                        </Paragraph>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                )}
                <Pagination
                    style={{fontSize: "18px"}}
                    align="center"
                    total={count}
                    current={currentPage}
                    pageSize={currentPageSize}
                    pageSizeOptions={[
                        10, 20, 30, 50
                    ]}
                    showTotal={(total,range) => `共${total}条数据，当前${range[0]} - ${range[1]}`}
                    hideOnSinglePage
                onChange={handlePageChange}
                />
            </div>
        </Content>
    );
};

export default ResultPage;