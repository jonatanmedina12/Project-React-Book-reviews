import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Layout, Menu, Input, Button, Dropdown, Avatar, Badge, Drawer, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  BellOutlined,
  HeartOutlined,
  SearchOutlined,
  AppstoreOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../theme/ThemeToggle';
import './MainLayout.css';

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

/**
 * MainLayout Component
 * 
 * Provides the main application layout with modern styling
 */
const MainLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    navigate(`/?search=${encodeURIComponent(value)}`);
    if (searchVisible) {
      setSearchVisible(false);
    }
  };

  // Dropdown menu items con tipos correctos
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Mi Perfil',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'favorites',
      label: 'Mis Favoritos',
      icon: <HeartOutlined />,
      onClick: () => navigate('/favorites'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Cerrar Sesión',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  // Elementos de la barra de navegación
  const navItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <AppstoreOutlined />,
      label: <Link to="/">Inicio</Link>,
    },
    {
      key: '/books',
      icon: <ReadOutlined />,
      label: <Link to="/books">Libros</Link>,
    },
    {
      key: '/categories',
      icon: <BookOutlined />,
      label: <Link to="/categories">Categorías</Link>,
    }
  ];

  // Drawer menu items
  const drawerNavItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <AppstoreOutlined />,
      label: 'Inicio',
      onClick: () => {
        navigate('/');
        toggleMobileMenu();
      }
    },
    {
      key: '/books',
      icon: <ReadOutlined />,
      label: 'Libros',
      onClick: () => {
        navigate('/books');
        toggleMobileMenu();
      }
    },
    {
      key: '/categories',
      icon: <BookOutlined />,
      label: 'Categorías',
      onClick: () => {
        navigate('/categories');
        toggleMobileMenu();
      }
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: (
        <span>
          Notificaciones
          <Badge count={3} style={{ marginLeft: 8 }} />
        </span>
      ),
      onClick: () => {
        navigate('/notifications');
        toggleMobileMenu();
      }
    },
  ];

  // User drawer items
  const userDrawerItems: MenuProps['items'] = isAuthenticated ? [
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
      onClick: () => {
        navigate('/profile');
        toggleMobileMenu();
      }
    },
    {
      key: '/favorites',
      icon: <HeartOutlined />,
      label: 'Mis Favoritos',
      onClick: () => {
        navigate('/favorites');
        toggleMobileMenu();
      }
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      danger: true,
      onClick: () => {
        logout();
        toggleMobileMenu();
      }
    },
  ] : [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: 'Iniciar Sesión',
      onClick: () => {
        navigate('/login');
        toggleMobileMenu();
      }
    },
    {
      key: 'register',
      icon: <UserAddOutlined />,
      label: 'Registro',
      onClick: () => {
        navigate('/register');
        toggleMobileMenu();
      }
    },
  ];

  return (
    <Layout className="modern-layout">
      <Header className="modern-header">
        <div className="header-container">
          <div className="header-left">
            {/* Mobile menu button */}
            <Button 
              type="text"
              className="mobile-menu-button"
              icon={<MenuOutlined />}
              onClick={toggleMobileMenu}
            />
            
            {/* Logo and brand */}
            <Link to="/" className="brand-logo">
              <BookOutlined />
              <Title level={4}>BookReviews</Title>
            </Link>
            
            {/* Navigation menu - desktop */}
            <Menu
              mode="horizontal"
              className="nav-menu desktop-only"
              selectedKeys={[window.location.pathname]}
              items={navItems}
            />
          </div>
          
          <div className="header-right">
            {/* Search button (mobile) */}
            <Button
              type="text"
              className="search-toggle-button mobile-only"
              icon={<SearchOutlined />}
              onClick={toggleSearch}
            />
            
            {/* Search input (desktop) */}
            <div className="search-container desktop-only">
              <Search
                placeholder="Buscar libros..."
                allowClear
                onSearch={handleSearch}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* User section */}
            {isAuthenticated ? (
              <div className="user-section">
                <Badge count={3} dot className="desktop-only">
                  <Button
                    type="text"
                    className="notification-button desktop-only"
                    icon={<BellOutlined />}
                    onClick={() => navigate('/notifications')}
                  />
                </Badge>
                
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                  <div className="user-avatar-wrapper">
                    <Avatar 
                      src={user?.profileImage} 
                      icon={!user?.profileImage && <UserOutlined />}
                      size="large"
                      className="user-avatar"
                    />
                    <span className="user-name desktop-only">{user?.username}</span>
                  </div>
                </Dropdown>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="desktop-only">
                  <Button type="link">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">Registro</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile search container */}
        {searchVisible && (
          <div className="mobile-search-container">
            <Search
              placeholder="Buscar libros..."
              allowClear
              onSearch={handleSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search"
              autoFocus
            />
          </div>
        )}
      </Header>
      
      {/* Mobile menu drawer */}
      <Drawer
        title={
          <div className="drawer-header">
            <div className="drawer-logo">
              <BookOutlined />
              <span>BookReviews</span>
            </div>
            {user && (
              <div className="drawer-user">
                <Avatar
                  src={user.profileImage}
                  icon={!user.profileImage && <UserOutlined />}
                  size="small"
                />
                <span>{user.username}</span>
              </div>
            )}
          </div>
        }
        placement="left"
        onClose={toggleMobileMenu}
        open={mobileMenuVisible}
        width={280}
        className="mobile-menu-drawer"
      >
        <Menu 
          mode="vertical"
          className="drawer-menu"
          selectedKeys={[window.location.pathname]}
          items={drawerNavItems}
        />
        
        <div className="drawer-divider" />
        
        <Menu 
          mode="vertical"
          className="drawer-menu"
          items={userDrawerItems}
        />
      </Drawer>
      
      {/* Main content */}
      <Content className="modern-content">
        <div className="content-container">
          <Outlet />
        </div>
      </Content>
      
      {/* Footer */}
      <Footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/about">Acerca de</Link>
            <Link to="/contact">Contacto</Link>
            <Link to="/privacy">Privacidad</Link>
            <Link to="/terms">Términos</Link>
          </div>
          <Text className="copyright">
            BookReviews © {new Date().getFullYear()} | Creado con React, TypeScript y Ant Design
          </Text>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;