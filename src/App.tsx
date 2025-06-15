import {PictureOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import type {MenuProps} from 'antd';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import './App.css';
import VerticalNavigationLayout from "./layout/VerticalNavigationLayout";
import CompareImage from "./pages/CompareImage";
import FaceUpload from "./pages/FaceUpload.tsx";
import LookALike from "./pages/LookALike.tsx";
import Search from "./pages/Search.tsx";

// Kiểu MenuItem đúng chuẩn Ant Design
type MenuItem = Required<MenuProps>['items'][number];

function App() {
    const menuItems: MenuItem[] = [
        {
            key: 'face-upload',
            label: 'Nhận diện khuôn mặt',
            icon: <UserOutlined/>
        },
        {
            key: 'compare-face',
            label: 'So sánh khuôn mặt',
            icon: <PictureOutlined/>
        },
        {
            key: 'look-like',
            label: 'Tìm người giống nhau',
            icon: <SearchOutlined/>
        },
        {
            key: 'search',
            label: 'Tìm kiếm',
            icon: <SearchOutlined />
        }
    ];

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/feature/face-upload" replace />} />
                    <Route path="/feature/" element={
                        <VerticalNavigationLayout
                            menuItems={menuItems}
                            defaultSelectedKey={menuItems.length > 0 ? (menuItems[0]!.key as string) : ''}
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
    );
}

export default App;
