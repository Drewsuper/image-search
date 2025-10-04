import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from "../page/index";
import ResultPage from "../page/result";
import LayoutPage from "../page/Layout";

const router = createBrowserRouter([
    {
        element: <LayoutPage />,
        children:[
            {
                path:"/",
                element: <IndexPage />
            },
            {
                path:"/search",
                element: <ResultPage />
            }
        ]
    }
]);

const RouterComponent = () => {
    return <RouterProvider router={router} />
};

export default RouterComponent;

