import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    try {
      setSubmitting(true);
      await register(values.username, values.email, values.password);
    } catch (error) {
      console.error('Error de registro:', error);
      // El mensaje de error ya se muestra en el contexto de autenticación
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '0 16px' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>Registro</Title>
          <Text type="secondary">Crea una cuenta para empezar a usar la aplicación</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label="Nombre de usuario"
            rules={[
              { required: true, message: 'Por favor ingresa un nombre de usuario' },
              { min: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre de usuario" />
          </Form.Item>

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
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar contraseña"
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
              prefix={<LockOutlined />}
              placeholder="Confirmar contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting || loading}
            >
              Registrarse
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>¿Ya tienes una cuenta?</Divider>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">
            <Button type="link">Inicia sesión</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;