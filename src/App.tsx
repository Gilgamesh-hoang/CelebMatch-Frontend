import {PictureOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import type {MenuProps} from 'antd';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import './App.css';
import Nav from "./component/nav/Nav";
import VerticalNavigationLayout from "./layout/VerticalNavigationLayout";
import CompareImage from "./pages/CompareImage";
import FaceUpload from "./pages/FaceUpload";
import LookALike from "./pages/LookALike";


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
    ];

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/nav/face-upload" replace/>}/>
                <Route path="/nav" element={
                    <VerticalNavigationLayout
                        menuItems={menuItems}
                        defaultSelectedKey={menuItems.length > 0 ? (menuItems[0]!.key as string) : ''}
                    />
                }>
                    <Route path="face-upload" element={<FaceUpload/>}/>
                    <Route path="compare-face" element={<CompareImage/>}/>
                    <Route path="look-like" element={<LookALike/>}/>
                    {menuItems.slice(3).map((menuItem) => {
                        if (!menuItem || !('label' in menuItem)) return null;

                        return (
                            <Route
                                key={menuItem.key as string}
                                path={menuItem.key as string}
                                element={<Nav label={menuItem.label as string} />}
                            />
                        );
                    })}

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
