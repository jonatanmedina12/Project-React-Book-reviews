import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Divider } from 'antd';
import {  LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setSubmitting(true);
      await login(values.email, values.password);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      // El mensaje de error ya se muestra en el contexto de autenticación
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '0 16px' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>Iniciar Sesión</Title>
          <Text type="secondary">Inicia sesión para acceder a tu cuenta</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo electrónico' },
              { type: 'email', message: 'Por favor ingresa un correo electrónico válido' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="correo@ejemplo.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor ingresa tu contraseña' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting || loading}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>¿No tienes una cuenta?</Divider>

        <div style={{ textAlign: 'center' }}>
          <Link to="/register">
            <Button type="link">Regístrate ahora</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;