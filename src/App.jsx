import { useEffect, useId, useState } from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form'; // Add this line
import api from '../services/api';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './App.css'; // Import your custom CSS file

function App() {
  const [statements, setStatements] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [isUserId, setIsUserid] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    contenidoLargo: '',
    userName: '',
    userId: ""
  });
  const [serch, setSerch] = useState("")
  useEffect(() => {
    const getDatos = async () => {
      try {
        const res = await api.get(`/api/statements?name=${serch}`);
        console.log(res); // Log the entire response
        setStatements(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getDatos()
  }, [formData, serch])

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSerch(e.target.value); // Update the search state
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      console.log(formData)
      const response = await api.post("/api/statements", formData);
      console.log(response.data); // Log the response from the API
      setStatements([...statements, response.data]); // Update the statements with the new one
      handleClose(); // Close the modal
      setFormData({ titulo: '', contenidoLargo: '', userName: '' }); // Reset form data
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handlerShowPost = (id) => {
    setShowModal(true);
    setIsUserid(true);
    setFormData({
      ...formData, // Keep existing form data
      userId: id // Set userId to the passed id
    });
  };
  return (
    <>
      <div className="container mt-4">
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Buscar..."
            aria-label="search"
            aria-describedby="basic-addon1"
            value={serch}
            onChange={handleSearchChange}
          />
        </InputGroup>

        <div className="d-grid gap-2 mb-4">
          <Button variant="primary" size="lg" onClick={handleShow}>
            Agregar una historia de alguien
          </Button>
        </div>

        <div className="row">
          {statements?.length > 0 && statements.map(s => (
            <div className="col-md-4 mb-3" key={s.id}>
              <Card style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Title>{s.titulo}</Card.Title>
                  <Card.Text>
                    {s?.user?.name ? <h5>De la persona {s.user.name}</h5> : ""}
                    {s.contenidoLargo}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handlerShowPost(s.user.id)}>Otra historia de la misma persona</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Historia</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicTitle">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ingrese el título"
                />
              </Form.Group>
              <Form.Group controlId="formBasicContent">
                <Form.Label>¿Qué pasó?</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="contenidoLargo"
                  value={formData.contenidoLargo}
                  onChange={handleInputChange}
                  placeholder="Ingrese el contenido"
                />
              </Form.Group>
              {isUserId ? "" : <Form.Group controlId="formBasicUser">
                <Form.Label>De la persona</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Ingrese el nombre y de donde es"
                />
              </Form.Group>}
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cerrar
                </Button>
                <Button variant="primary" type="submit">
                  Guardar Cambios
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

export default App