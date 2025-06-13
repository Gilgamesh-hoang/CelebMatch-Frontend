import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NormalLayout from "./layout/NormalLayout.tsx";
import VerticalNavigationLayout from "./layout/VerticalNavigationLayout.tsx";
import { ExportOutlined } from "@ant-design/icons";
import FaceUpload from "./pages/FaceUpload";
import CompareImage from "./pages/CompareImage.tsx";
import LookALike from "./pages/LookALike.tsx";
import Search from "./pages/Search.tsx";

function App() {
    const menuItems = [
        {
            key: 'face-upload',
            label: 'Nhận diện khuôn mặt',
            icon: <ExportOutlined />
        },
        {
            key: 'compare-face',
            label: 'So sánh khuôn mặt',
            icon: <ExportOutlined />
        },
        {
            key: 'look-like',
            label: 'Tìm người giống nhau',
            icon: <ExportOutlined />
        },
        {
            key: 'search',
            label: 'Tìm kiếm',
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
                    <Route path="/" element={<Navigate to="/feature/face-upload" replace />} />

                    <Route element={<NormalLayout />}>
                        <Route path="/upload-face" element={<FaceUpload />} />
                    </Route>

                    <Route path="/feature/" element={
                        <VerticalNavigationLayout
                            menuItems={menuItems}
                            defaultSelectedKey={menuItems[0].key}
                        />
                    }>
                        <Route path="face-upload" element={<FaceUpload />} />
                        <Route path="compare-face" element={<CompareImage />} />
                        <Route path="look-like" element={<LookALike />} />
                        <Route path='search' element={<Search />} />
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
