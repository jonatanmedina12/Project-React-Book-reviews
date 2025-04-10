import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { changePassword, ChangePasswordRequest } from '../../services/usersService';
import './css/PasswordForm.css';

interface PasswordFormProps {
  onSuccess?: () => void;
}

/**
 * Componente para cambiar la contraseña del usuario
 * Sigue el principio de responsabilidad única (SRP) para la gestión de contraseñas
 */
const PasswordForm: React.FC<PasswordFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /**
   * Maneja el envío del formulario
   * @param values Valores del formulario
   */
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Validar que las contraseñas coincidan
      if (values.newPassword !== values.confirmNewPassword) {
        message.error('Las contraseñas nuevas no coinciden');
        return;
      }
      
      // Preparar datos para la API
      const passwordData: ChangePasswordRequest = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword
      };
      
      // Enviar solicitud de cambio de contraseña
      await changePassword(passwordData);
      
      // Mostrar mensaje de éxito y limpiar formulario
      message.success('Contraseña actualizada correctamente');
      form.resetFields();
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error('Error al cambiar la contraseña');
      console.error('Error al cambiar contraseña:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-form-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="password-form"
      >
        <Form.Item
          name="currentPassword"
          label="Contraseña actual"
          rules={[
            { required: true, message: 'Por favor ingresa tu contraseña actual' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Contraseña actual" 
            className="password-input"
          />
        </Form.Item>
        
        <Form.Item
          name="newPassword"
          label="Nueva contraseña"
          rules={[
            { required: true, message: 'Por favor ingresa tu nueva contraseña' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Nueva contraseña" 
            className="password-input"
          />
        </Form.Item>
        
        <Form.Item
          name="confirmNewPassword"
          label="Confirmar nueva contraseña"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Por favor confirma tu nueva contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            })
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Confirmar nueva contraseña" 
            className="password-input"
          />
        </Form.Item>
        
        <Form.Item className="form-buttons">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-button"
          >
            Cambiar contraseña
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PasswordForm;