import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Avatar, Upload, message, Spin, Alert } from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined } from '@ant-design/icons';
import { getUserProfile, updateUserProfile } from '../../services/usersService';
import { useAuth } from '../../context/AuthContext';
import type { RcFile } from 'antd/lib/upload/interface';
import './css/ProfileForm.css';

// Tamaño máximo para la carga de imágenes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ProfileFormProps {
  onSuccess?: () => void;
}

/**
 * Componente de formulario para editar información del perfil
 */
const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
      });
      setImageUrl(user.profileImage);
    } else {
      fetchUserProfile();
    }
  }, [form, user]);

  /**
   * Obtiene los datos del perfil del usuario
   */
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await getUserProfile();
      form.setFieldsValue({
        username: userProfile.username,
        email: userProfile.email,
      });
      setImageUrl(userProfile.profileImage);
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
      setError('No se pudieron cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la carga de la imagen de perfil
   * @param file - Archivo a cargar
   * @returns Booleano indicando si debe continuar la carga
   */
  const handleImageUpload = (file: RcFile): boolean => {
    // Verificar el tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      message.error('La imagen debe ser menor a 5MB');
      return false;
    }

    // Verificar el tipo de archivo (solo imágenes)
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Solo se permiten archivos de imagen');
      return false;
    }

    setImageLoading(true);
    setError(null);

    // Convertir la imagen a base64 para mostrarla previamente
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setImageLoading(false);
    };

    // Evitar la carga automática
    return false;
  };

  /**
   * Envía el formulario para actualizar el perfil
   * @param values - Valores del formulario
   */
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateUserProfile({
        username: values.username,
        email: values.email,
        profileImage: imageUrl
      });
      
      message.success('Perfil actualizado correctamente');
      
      // Esperar un momento antes de recargar para que se muestre el mensaje
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      
      // Extraer y mostrar el mensaje de error
      let errorMessage = 'Error al actualizar el perfil';
      
      if (error.response) {
        // Si es un error de respuesta del servidor
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data && error.response.data.errors) {
          // Si es un objeto de errores de validación
          const errorKeys = Object.keys(error.response.data.errors);
          if (errorKeys.length > 0) {
            const firstErrorKey = errorKeys[0];
            errorMessage = error.response.data.errors[firstErrorKey][0];
          }
        } else if (error.response.data && error.response.data.title) {
          // Si es un objeto ProblemDetails de ASP.NET Core
          errorMessage = `${error.response.data.title}: ${error.response.data.detail || ''}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-form-container">
      {error && (
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
          className="profile-form-error"
          closable
          onClose={() => setError(null)}
        />
      )}
      
      {loading && !error ? (
        <div className="profile-form-loading">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="profile-form-avatar-section">
            <div className="profile-form-avatar-container">
              {imageLoading ? (
                <Spin className="profile-form-avatar-loading" />
              ) : (
                <Avatar
                  size={100}
                  src={imageUrl}
                  icon={!imageUrl ? <UserOutlined /> : undefined}
                  className="profile-form-avatar"
                />
              )}
            </div>
            
            <Upload
              name="profilePicture"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
              className="profile-form-upload"
            >
              <Button icon={<UploadOutlined />}>
                Cambiar imagen
              </Button>
            </Upload>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="profile-form"
          >
            <Form.Item
              name="username"
              label="Nombre de usuario"
              rules={[
                { required: true, message: 'Por favor ingresa tu nombre de usuario' },
                { min: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres' },
                { max: 50, message: 'El nombre de usuario no puede exceder los 50 caracteres' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nombre de usuario" 
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Correo electrónico"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo electrónico' },
                { type: 'email', message: 'Por favor ingresa un correo electrónico válido' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Correo electrónico" 
              />
            </Form.Item>

            <Form.Item className="profile-form-submit">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="profile-form-submit-button"
              >
                Guardar cambios
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default ProfileForm;