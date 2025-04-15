import {Breadcrumb, Button, Layout, Menu, MenuProps, theme} from "antd";
import {useEffect, useState} from "react";
import Sider from "antd/es/layout/Sider";
import {Content, Header} from "antd/es/layout/layout";
import { useLocation, useNavigate } from 'react-router'
import {Outlet} from "react-router-dom";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
    menuItems: MenuItem[];
    defaultSelectedKey: string
}

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

const VerticalNavigationLayout = ({menuItems, defaultSelectedKey}: Props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>(defaultSelectedKey);
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const breadcrumbItems = location.pathname.split('/').filter(Boolean);

    useEffect(() => {
        if (breadcrumbItems.length < 2){
            navigate(defaultSelectedKey);
        }
    }, [defaultSelectedKey]);

    useEffect(() => {
        const item = menuItems.find((item) => location.pathname.endsWith(item!.key as string));
        if (item){
            setSelectedKey(item.key as string);
        }
    }, [location]);

    const selectedItem = menuItems.find((item) => item!.key === selectedKey);
    const selectedLabel = typeof selectedItem?.label === 'string' ? selectedItem.label : '';

    return (
        <Layout hasSider style={{ minHeight: '100vh' }}>
            <Sider style={siderStyle} collapsible collapsed={collapsed} trigger={null} theme="light">
                <Menu
                    defaultSelectedKeys={[defaultSelectedKey]}
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    items={menuItems}
                    onClick={({key}) => {
                        setSelectedKey(key);
                        navigate(key)
                    }}
                />
            </Sider>
            <Layout>
                <Header style={{padding: 0, background: colorBgContainer}}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    {selectedLabel}
                </Header>
                <Content style={{ margin: '0 16px', overflow: 'initial'  }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        {
                            breadcrumbItems.map((breadcrumbItem, index) => (
                                <Breadcrumb.Item key={index}>{breadcrumbItem}</Breadcrumb.Item>
                            ))
                        }
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}
export default VerticalNavigationLayout
