import React, { useState } from 'react';
import { Form, Input, Button, Typography, Divider, message } from 'antd';
import { 
  LockOutlined, 
  MailOutlined, 
  UserOutlined,
  GithubOutlined, 
  GoogleOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const { Title, Text } = Typography;

/**
 * Register Component
 * 
 * Modern design matching the login page style
 */
const Register: React.FC = () => {
  // Get authentication context
  const { register, isAuthenticated, loading } = useAuth();
  
  // Form state management
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  /**
   * Handle form submission
   * @param values - Form values containing username, email, password, and confirmPassword
   */
  const handleSubmit = async (values: { 
    username: string; 
    email: string; 
    password: string; 
    confirmPassword: string 
  }) => {
    try {
      setSubmitting(true);
      await register(values.username, values.email, values.password);
      message.success('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
    } catch (error) {
      console.error('Error de registro:', error);
      message.error('Error al crear la cuenta. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle sign up with GitHub
   */
  const handleGitHubRegister = () => {
    message.info('Registro con GitHub en desarrollo');
  };

  /**
   * Handle sign up with Google
   */
  const handleGoogleRegister = () => {
    message.info('Registro con Google en desarrollo');
  };

  return (
    <div className="modern-login-container"> {/* Reusing login container styles */}
      <div className="modern-login-content">
        <div className="modern-login-form-container">
          <div className="modern-login-logo">
            <BookOutlined />
          </div>
          <Title level={3} className="modern-login-title">Crear Cuenta</Title>
          <Text className="modern-login-subtitle">
            Únete a nuestra comunidad de lectores
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            className="modern-login-form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Por favor ingresa un nombre de usuario' },
                { min: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres' },
              ]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Nombre de usuario" 
                size="large"
                className="modern-input"
              />
            </Form.Item>

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
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Contraseña"
                size="large"
                className="modern-input"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Por favor confirma tu contraseña' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Confirmar contraseña"
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
                Registrarse
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
            onClick={handleGitHubRegister}
          >
            Registrarse con GitHub
          </Button>

          <Button
            icon={<GoogleOutlined />}
            block
            className="modern-google-button"
            size="large"
            onClick={handleGoogleRegister}
          >
            Registrarse con Google
          </Button>

          <div className="modern-login-footer">
            <Text>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login">Inicia sesión</Link>
            </Text>
            <div style={{ marginTop: '12px' }}>
              Al registrarte, aceptas nuestros{' '}
              <Link to="/terms">Términos de Servicio</Link> y{' '}
              <Link to="/privacy">Política de Privacidad</Link>
            </div>
          </div>
        </div>

        <div className="modern-login-info">
          <div className="modern-login-info-content">
            <Title level={2} className="modern-info-title">
              Comienza tu viaje literario
            </Title>
            <Title level={3} className="modern-info-subtitle">
              Descubre, organiza y comparte tus lecturas favoritas
            </Title>
            
            <div className="register-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">Organiza tu biblioteca personal</div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">Descubre nuevas recomendaciones</div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">Comparte reseñas con la comunidad</div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">Lleva tu progreso de lectura</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;