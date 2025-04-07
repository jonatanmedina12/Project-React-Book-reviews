import React, { useState } from 'react';
import { Form, Input, Button, Typography, Divider, message } from 'antd';
import { 
  LockOutlined, 
  MailOutlined, 
  GithubOutlined, 
  GoogleOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const { Title, Text } = Typography;

/**
 * Login Component
 * 
 * Modern design inspired by Jam's login page with enhanced styling
 */
const Login: React.FC = () => {
  // Get authentication context
  const { login, isAuthenticated, loading } = useAuth();
  
  // Form state management
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  /**
   * Handle form submission
   * @param values - Form values containing email and password
   */
  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setSubmitting(true);
      await login(values.email, values.password);
      message.success('¡Inicio de sesión exitoso!');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      message.error('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle sign in with GitHub
   */
  const handleGitHubLogin = () => {
    message.info('Inicio de sesión con GitHub en desarrollo');
  };

  /**
   * Handle sign in with Google
   */
  const handleGoogleLogin = () => {
    message.info('Inicio de sesión con Google en desarrollo');
  };

  return (
    <div className="modern-login-container">
      <div className="modern-login-content">
        <div className="modern-login-form-container">
          <div className="modern-login-logo">
            <BookOutlined />
          </div>
          <Title level={3} className="modern-login-title">¡Bienvenido!</Title>
          <Text className="modern-login-subtitle">
            Inicia sesión para acceder a tu biblioteca virtual
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            className="modern-login-form"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo electrónico' },
                { type: 'email', message: 'Por favor ingresa un correo electrónico válido' },
              ]}
            >
              <Input 
                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Correo electrónico" 
                size="large"
                className="modern-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Por favor ingresa tu contraseña' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Contraseña"
                size="large"
                className="modern-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting || loading}
                className="modern-primary-button"
                size="large"
              >
                Continuar
              </Button>
            </Form.Item>
          </Form>

          <div className="modern-divider">
            <Divider>O</Divider>
          </div>

          <Button
            icon={<GithubOutlined />}
            block
            className="modern-github-button"
            size="large"
            onClick={handleGitHubLogin}
          >
            Continuar con GitHub
          </Button>

          <Button
            icon={<GoogleOutlined />}
            block
            className="modern-google-button"
            size="large"
            onClick={handleGoogleLogin}
          >
            Continuar con Google
          </Button>

          <div className="modern-login-footer">
            <Text>
              ¿No tienes una cuenta?{' '}
              <Link to="/register">Regístrate ahora</Link>
            </Text>
            <div style={{ marginTop: '12px' }}>
              Al hacer clic en continuar, aceptas nuestros{' '}
              <Link to="/terms">Términos de Servicio</Link> y{' '}
              <Link to="/privacy">Política de Privacidad</Link>
            </div>
          </div>
        </div>

        <div className="modern-login-info">
          <div className="modern-login-info-content">
            <Title level={2} className="modern-info-title">
              Estás en buena compañía
            </Title>
            <Title level={3} className="modern-info-subtitle">
              Más de 5,000 lectores y contando
            </Title>
            
            <div className="company-logos">
              <div className="logo-item"></div>
              <div className="logo-item"></div>
              <div className="logo-item"></div>
              <div className="logo-item"></div>
              <div className="logo-item"></div>
              <div className="logo-item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;