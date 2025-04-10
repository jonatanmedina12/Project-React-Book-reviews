import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  message, 
  Popconfirm, 
  Typography,
  Card,
  Rate,
  Drawer
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  EyeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Book, BookDetails } from '../../types/Book';
import { 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook
} from '../../services/bookService';
import { getCategories } from '../../services/categoryService';
import { useAuth } from '../../context/AuthContext';
import BookForm from '../books/BookForm';
import BookImage from '../common/BookImage';
import { Category } from '../../types/Category';
import './css/BookManager.css';

const { Title, Text } = Typography;

/**
 * Componente para administrar libros (CRUD)
 * Sigue el principio de responsabilidad única (SRP) para la administración de libros
 */
const BookManager: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentBook, setCurrentBook] = useState<Partial<BookDetails>>({});
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === 'Admin';

  // Cargar libros y categorías al montar el componente o cuando cambian los parámetros de paginación
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchBooks();
      fetchCategories();
    }
  }, [currentPage, pageSize, isAuthenticated, isAdmin]);

  /**
   * Obtiene la lista de libros desde el API
   */
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getBooks(currentPage, pageSize);
      setBooks(response.books);
      setTotal(response.total);
    } catch (error) {
      console.error('Error al cargar libros:', error);
      message.error('No se pudieron cargar los libros.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene la lista de categorías disponibles
   */
  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      message.error('No se pudieron cargar las categorías.');
    }
  };

  /**
   * Abre el drawer para crear un nuevo libro
   */
  const showCreateDrawer = () => {
    setIsEditing(false);
    setCurrentBook({});
    setDrawerVisible(true);
  };

  /**
   * Abre el drawer para editar un libro existente
   * @param bookId - ID del libro a editar
   */
  const showEditDrawer = async (bookId: string) => {
    try {
      setLoading(true);
      const book = await getBookById(bookId);
      setCurrentBook(book);
      setIsEditing(true);
      setDrawerVisible(true);
    } catch (error) {
      console.error('Error al cargar datos del libro:', error);
      message.error('No se pudieron cargar los datos del libro.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra el drawer de creación/edición
   */
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  /**
   * Maneja el envío del formulario de creación/edición
   * @param bookData - Datos del libro a guardar
   */
  const handleSubmit = async (bookData: Partial<Book>) => {
    try {
      setSubmitLoading(true);
      
      if (isEditing && currentBook.id) {
        // Actualizar libro existente
        // Incluir el ID original en los datos a actualizar
        const dataToUpdate = {
          ...bookData,
          id: currentBook.id
        };
        
        // Enviar todos los datos, incluyendo la imagen en base64 si existe
        await updateBook(currentBook.id.toString(), dataToUpdate);
        message.success('Libro actualizado con éxito.');
      } else {
        // Crear nuevo libro
        await createBook(bookData);
        message.success('Libro creado con éxito.');
      }
      
      // Cerrar drawer y recargar datos
      setDrawerVisible(false);
      fetchBooks();
    } catch (error) {
      console.error('Error al guardar libro:', error);
      message.error('Error al guardar el libro. Inténtelo de nuevo.');
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * Maneja la eliminación de un libro
   * @param bookId - ID del libro a eliminar
   */
  const handleDelete = async (bookId: string) => {
    try {
      setLoading(true);
      await deleteBook(bookId);
      message.success('Libro eliminado con éxito.');
      fetchBooks();
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      message.error('No se pudo eliminar el libro.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el cambio de página en la tabla
   * @param pagination - Datos de paginación
   */
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  
  /**
   * Navega a la página de detalles del libro
   * @param bookId - ID del libro a ver
   */
  const handleViewBook = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  // Columnas para la tabla de libros
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: 'Portada',
      dataIndex: 'coverImageUrl',
      key: 'coverImageUrl',
      width: 100,
      render: (coverImageUrl: string, record: Book) => (
        <div className="book-cover-cell">
          <BookImage 
            src={coverImageUrl}
            alt={record.title}
            width={50}
            height={75}
            borderRadius="4px"
          />
        </div>
      )
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      className: 'book-title-cell'
    },
    {
      title: 'Autor',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Categoría',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Valoración',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating: number) => (
        <Space>
          <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: 14 }} />
          <Text>{rating.toFixed(1)}</Text>
        </Space>
      )
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200,
      render: (_: any, record: Book) => (
        <div className="action-buttons">
          <Button 
            type="default" 
            icon={<EyeOutlined />}
            onClick={() => handleViewBook(record.id.toString())} 
            title="Ver libro"
            className="action-button view-button"
          />
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => showEditDrawer(record.id.toString())} 
            title="Editar libro"
            className="action-button edit-button"
          />
          <Popconfirm
            title="¿Está seguro de eliminar este libro?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDelete(record.id.toString())}
            okText="Sí"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              title="Eliminar libro"
              className="action-button delete-button"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Si el usuario no está autenticado o no es admin, mostrar mensaje de acceso denegado
  if (!isAuthenticated || !isAdmin) {
    return (
      <Card className="access-denied">
        <div>
          <Title level={3} className="access-denied-title">Acceso Restringido</Title>
          <Text className="access-denied-text">Esta sección es solo para administradores.</Text>
          <div className="access-denied-button">
            <Button type="primary" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="book-manager">
      {/* Botón de volver */}
      <Button
        icon={<ArrowLeftOutlined />}
        className="back-button"
        onClick={() => navigate(-1)}
      >
        Volver
      </Button>
      
      {/* Cabecera centrada */}
      <div className="book-manager-header">
        <Title level={2} className="book-manager-title">Administrar Libros</Title>
        
        {/* Sección de acciones centrada */}
        <div className="book-manager-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showCreateDrawer}
            className="create-button"
          >
            Nuevo Libro
          </Button>
        </div>
      </div>

      {/* Tabla de libros */}
      <Card className="books-card">
        <Table
          columns={columns}
          dataSource={books}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          onChange={handleTableChange}
          className="books-table"
        />
      </Card>

      {/* Drawer para crear/editar libros */}
      <Drawer
        title={isEditing ? 'Editar Libro' : 'Crear Nuevo Libro'}
        width={"50%"}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        styles={{ body: { paddingBottom: 80 } }}
        className="book-drawer"
      >
        <BookForm
          initialValues={currentBook}
          onSubmit={handleSubmit}
          loading={submitLoading}
          isUpdate={isEditing}
        />
      </Drawer>
    </div>
  );
};

export default BookManager;