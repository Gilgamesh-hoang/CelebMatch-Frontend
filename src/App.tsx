import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainLayout from "./layout/MainLayout.tsx";
import NormalLayout from "./layout/NormalLayout.tsx";
import VerticalNavigationLayout from "./layout/VerticalNavigationLayout.tsx";
import {ExportOutlined} from "@ant-design/icons";
import Nav from "./component/nav/Nav.tsx";
import FaceUpload from "./pages/FaceUpload"
import CompareImage from "./pages/CompareImage.tsx";

function App() {
    const menuItems = Array.from({ length: 100 }, (_, index) => {
        return {
            key: `nav-${index + 1}`,
            label: `Nav ${index + 1}`,
            icon: <ExportOutlined />
        }
    })
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        {/*<Route index element={<Home />} />*/}
                    </Route>
                    <Route element={<NormalLayout/>}>
                        {/*<Route path="/login" element={<Login />} />*/}
                        <Route path="/upload-face" element={<FaceUpload />} />
                        <Route path="/compare-face" element={<CompareImage />} />
                    </Route>

                    <Route path="/nav/" element={
                        <VerticalNavigationLayout
                            // menuItems={[
                            //     {
                            //         key: 'nav-1', // Key là path
                            //         label: 'Nav 1',
                            //         icon: <ExportOutlined />
                            //     },
                            //     {
                            //         key: 'nav-2', // Key là path
                            //         label: 'Nav 2',
                            //         icon: <ExportOutlined />
                            //     }
                            // ]}
                            menuItems={menuItems}
                            // defaultSelectedKey="nav-1"
                            defaultSelectedKey={menuItems[0].key}
                        />
                    }>
                        {/*<Route path="nav-1" element={<Page 1/>}/>*/}
                        {/*<Route path="nav-2" element={<Page 2/>}/>*/}
                        {
                            menuItems.map((menuItem) => (
                                <>
                                    <Route path={menuItem.key} element={<Nav label={menuItem.label}/>}/>
                                </>
                            ))
                        }
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
