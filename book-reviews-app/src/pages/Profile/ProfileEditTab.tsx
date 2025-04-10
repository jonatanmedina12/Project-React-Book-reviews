import React, { useState } from 'react';
import { Tabs, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import './css/ProfileEditTab.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

/**
 * Componente para la pestaña de edición de perfil
 * Contiene tabs para actualizar información del perfil y cambiar contraseña
 */
const ProfileEditTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('info');
  
  /**
   * Maneja el cambio de pestaña
   * @param key Clave de la pestaña activa
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="profile-edit-tab-container">
      <Title level={4} className="section-title">Editar Perfil</Title>
      <Text type="secondary" className="section-description">
        Actualiza tu información personal y configuración de cuenta
      </Text>
      
      <Card className="profile-edit-card">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="profile-edit-tabs"
        >
          <TabPane
            tab={<span><UserOutlined /> Información Personal</span>}
            key="info"
          >
            <div className="tab-content">
              <ProfileForm 
                onSuccess={() => message.success('Perfil actualizado correctamente')}
              />
            </div>
          </TabPane>
          
          <TabPane
            tab={<span><LockOutlined /> Cambiar Contraseña</span>}
            key="password"
          >
            <div className="tab-content">
              <PasswordForm 
                onSuccess={() => message.success('Contraseña actualizada correctamente')}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfileEditTab;