import './App.css'
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import MainLayout from "./layout/MainLayout.tsx";
import NormalLayout from "./layout/NormalLayout.tsx";
import VerticalNavigationLayout from "./layout/VerticalNavigationLayout.tsx";
import {ExportOutlined} from "@ant-design/icons";
import Nav from "./component/nav/Nav.tsx";
import FaceUpload from "./pages/FaceUpload"
import CompareImage from "./pages/CompareImage.tsx";

function App() {
    const menuItems = [
        {
          key: 'face-upload',
          label: 'Nhận diện khuôn mặt',
          icon: <ExportOutlined />
        },
        ...Array.from({ length: 99 }, (_, index) => ({
          key: `nav-${index + 1}`,
          label: `Nav ${index + 1}`,
          icon: <ExportOutlined />
        }))
      ];
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/nav/face-upload" replace />} />
                    <Route element={<MainLayout/>}>
                        {/*<Route index element={<Home />} />*/}

                    </Route>
                    <Route element={<NormalLayout/>}>
                        {/*<Route path="/login" element={<Login />} />*/}
                        <Route path="/upload-face" element={<FaceUpload />} />
                        <Route path="/compare-face" element={<CompareImage />} />
                    </Route>

                    <Route path="/nav/" element={
                        <VerticalNavigationLayout
                            menuItems={menuItems}
                            // defaultSelectedKey="nav-1"
                            defaultSelectedKey={menuItems[0].key}
                        />
                    }>
                        <Route path="face-upload" element={<FaceUpload />} />
                            {
                                menuItems.slice(1).map((menuItem) => (
                                    <Route key={menuItem.key} path={menuItem.key} element={<Nav label={menuItem.label} />} />
                                ))
                            }
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
