import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NormalLayout from "./layout/NormalLayout.tsx";
import VerticalNavigationLayout from "./layout/VerticalNavigationLayout.tsx";
import { ExportOutlined } from "@ant-design/icons";
import Nav from "./component/nav/Nav.tsx";
import FaceUpload from "./pages/FaceUpload";
import CompareImage from "./pages/CompareImage.tsx";

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

                    <Route element={<NormalLayout />}>
                        <Route path="/upload-face" element={<FaceUpload />} />
                    </Route>

                    {/* Layout cho /nav */}
                    <Route path="/nav" element={
                        <VerticalNavigationLayout
                            menuItems={menuItems}
                            defaultSelectedKey={menuItems[0].key}
                        />
                    }>
                        <Route path="face-upload" element={<FaceUpload />} />
                        <Route path="compare-face" element={<CompareImage />} />
                        {menuItems.slice(1).map((menuItem) => (
                            <Route key={menuItem.key} path={menuItem.key} element={<Nav label={menuItem.label} />} />
                        ))}
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
