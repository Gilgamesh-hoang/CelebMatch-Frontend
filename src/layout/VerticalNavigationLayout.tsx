import {Button, Layout, Menu, MenuProps, theme} from "antd";
import {useEffect, useState} from "react";
import Sider from "antd/es/layout/Sider";
import {Content, Header} from "antd/es/layout/layout";
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
    menuItems: MenuItem[];
    defaultSelectedKey: string;
}

const VerticalNavigationLayout = ({ menuItems, defaultSelectedKey }: Props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>(defaultSelectedKey);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentItem = menuItems.find((item) => location.pathname.endsWith(item!.key as string));
        if (currentItem) {
            setSelectedKey(currentItem.key as string);
        }
    }, [location.pathname]);

    const selectedItem = menuItems.find((item) => item!.key === selectedKey);
    const selectedLabel =
        selectedItem && 'label' in selectedItem && typeof selectedItem.label === 'string'
            ? selectedItem.label
            : '';

    return (
        <Layout hasSider style={{ minHeight: '100vh' }}>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    backgroundColor: '#3DBFF2',
                    borderRight: '1px solid #e5e5e5',
                }}
                collapsible
                collapsed={collapsed}
                trigger={null}
                width={220}
            >
                <div style={{
                    height: 64,
                    margin: 16,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 18
                }}>
                    {!collapsed ? 'Face System' : 'FS'}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={({ key }) => {
                        setSelectedKey(key);
                        navigate(`/feature/${key}`);
                    }}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        fontWeight: 500,
                    }}
                    theme="light"
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: '0 16px',
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: 20,
                                width: 40,
                                height: 40,
                            }}
                        />
                        <h3 style={{ margin: 0 }}>{selectedLabel}</h3>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default VerticalNavigationLayout;
