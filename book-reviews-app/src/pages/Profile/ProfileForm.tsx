import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Avatar } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile, UpdateProfileRequest } from '../../services/usersService';
import type { UploadFile } from 'antd/es/upload/interface';
import './css/ProfileForm.css';

interface ProfileFormProps {
  onSuccess?: () => void;
}

/**
 * Componente para editar el perfil de usuario
 * Sigue el principio de responsabilidad única (SRP) para la edición de perfil
 */
const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(user?.profileImage);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Cargar los datos del perfil al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated]);

  /**
   * Obtiene los datos del perfil del usuario
   */
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      
      // Establecer los valores iniciales del formulario
      form.setFieldsValue({
        username: profile.username,
        email: profile.email
      });
      
      // Establecer la imagen de perfil si existe
      if (profile.profilePictureUrl) {
        setPreviewImage(profile.profilePictureUrl);
      }
    } catch (error) {
      message.error('Error al cargar los datos del perfil');
      console.error('Error al cargar datos del perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el envío del formulario
   * @param values Valores del formulario
   */
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Preparar los datos para actualizar
      const profileData: UpdateProfileRequest = {
        username: values.username,
        email: values.email
      };
      
      // Si hay una imagen base64, incluirla en los datos
      if (previewImage && (previewImage !== user?.profileImage)) {
        profileData.profilePictureUrl = previewImage;
      }
      
      // Actualizar el perfil
      await updateUserProfile(profileData);
      
      message.success('Perfil actualizado correctamente');
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error('Error al actualizar el perfil');
      console.error('Error al actualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Convierte un archivo a base64 para previsualización
   * @param file Archivo a convertir
   * @returns Promesa con la representación base64 del archivo
   */
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  /**
   * Maneja el cambio en el componente de carga de imagen
   * @param info Información del cambio
   */
  const handleImageChange = async (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      try {
        const base64 = await getBase64(file);
        setPreviewImage(base64);
        setFileList([info.file]);
      } catch (error) {
        console.error('Error al convertir imagen a base64:', error);
      }
    }
  };

  /**
   * Valida el tipo y tamaño de la imagen antes de subirla
   * @param file Archivo a validar
   * @returns true si es válido, false si no lo es
   */
  const beforeUpload = (file: File) => {
    // Validar el tipo de archivo
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Solo puedes subir imágenes JPG/PNG');
      return Upload.LIST_IGNORE;
    }
    
    // Validar el tamaño del archivo (2MB máximo)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB');
      return Upload.LIST_IGNORE;
    }
    
    return false; // Evitar la carga automática
  };

  return (
    <div className="profile-form-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="profile-form"
      >
        {/* Sección de imagen de perfil */}
        <div className="profile-image-section">
          <Avatar
            size={100}
            src={previewImage}
            icon={!previewImage ? <UserOutlined /> : undefined}
            className="profile-avatar"
          />
          
          <Upload
            name="avatar"
            listType="picture"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleImageChange}
            fileList={fileList}
            maxCount={1}
          >
            <Button 
              icon={<UploadOutlined />} 
              className="upload-button"
            >
              Cambiar imagen
            </Button>
          </Upload>
        </div>
        
        {/* Campos del formulario */}
        <Form.Item
          name="username"
          label="Nombre de usuario"
          rules={[
            { required: true, message: 'Por favor ingresa tu nombre de usuario' },
            { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
            { max: 50, message: 'El nombre no puede exceder los 50 caracteres' }
          ]}
        >
          <Input placeholder="Nombre de usuario" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Correo electrónico"
          rules={[
            { required: true, message: 'Por favor ingresa tu correo electrónico' },
            { type: 'email', message: 'Ingresa un correo electrónico válido' }
          ]}
        >
          <Input placeholder="Correo electrónico" />
        </Form.Item>
        
        {/* Botones de acción */}
        <Form.Item className="form-buttons">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-button"
          >
            Guardar cambios
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileForm;