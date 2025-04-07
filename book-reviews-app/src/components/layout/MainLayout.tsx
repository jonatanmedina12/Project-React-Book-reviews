// src/components/layout/MainLayout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Input, Button, Dropdown, Avatar, Space, Drawer } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const MainLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [, setSearchQuery] = useState('');
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    navigate(`/?search=${encodeURIComponent(value)}`);
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Mi Perfil',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Cerrar Sesión',
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  const showMobileMenu = () => {
    setMobileMenuVisible(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <BookOutlined style={{ fontSize: '24px', color: 'white', marginRight: '10px' }} />
          <h1 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
            BookReviews
          </h1>
        </div>

        {/* Menú para pantallas grandes */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center' }}>
          <Search
            placeholder="Buscar libros..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 300, marginRight: '20px' }}
          />
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar src={user?.profileImage} icon={<UserOutlined />} />
                <span style={{ color: 'white' }}>{user?.username}</span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button type="link" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
              <Button type="primary" icon={<UserAddOutlined />} onClick={() => navigate('/register')}>
                Registro
              </Button>
            </Space>
          )}
        </div>

        {/* Botón de menú para móviles */}
        <Button
          className="mobile-menu-button"
          icon={<MenuOutlined />}
          onClick={showMobileMenu}
          style={{ display: 'none', marginLeft: 'auto' }}
        />

        {/* Menú móvil */}
        <Drawer
          title="Menú"
          placement="right"
          onClose={closeMobileMenu}
          open={mobileMenuVisible}
          width={250}
        >
          <Search
            placeholder="Buscar libros..."
            allowClear
            onSearch={(value) => {
              handleSearch(value);
              closeMobileMenu();
            }}
            style={{ marginBottom: '20px' }}
          />
          <Menu mode="vertical" selectable={false}>
            <Menu.Item key="home" icon={<BookOutlined />} onClick={() => {
              navigate('/');
              closeMobileMenu();
            }}>
              Inicio
            </Menu.Item>
            {isAuthenticated ? (
              <>
                <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => {
                  navigate('/profile');
                  closeMobileMenu();
                }}>
                  Mi Perfil
                </Menu.Item>
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => {
                  logout();
                  closeMobileMenu();
                }}>
                  Cerrar Sesión
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item key="login" icon={<LoginOutlined />} onClick={() => {
                  navigate('/login');
                  closeMobileMenu();
                }}>
                  Iniciar Sesión
                </Menu.Item>
                <Menu.Item key="register" icon={<UserAddOutlined />} onClick={() => {
                  navigate('/register');
                  closeMobileMenu();
                }}>
                  Registro
                </Menu.Item>
              </>
            )}
          </Menu>
        </Drawer>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        BookReviews ©{new Date().getFullYear()} Creado con React, TypeScript y Ant Design
      </Footer>

      {/* CSS para responsividad */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
          .ant-layout-content {
            padding: 0 20px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default MainLayout;