import { Container, Row, Col } from "react-bootstrap";

export const Footer = () => {
  return (
    <footer className="site-footer">
      <Container fluid="md">
        <Row>
          <Col>
            <h5 className="footer-title">Achievement 3</h5>
            <p className="footer-text">
              A movie collection of various Korean dramas.
            </p>
          </Col>

          <Col xs="auto" className="footer-text">
            <p>© {new Date().getFullYear()}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};