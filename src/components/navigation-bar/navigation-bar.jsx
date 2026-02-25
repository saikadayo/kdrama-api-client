import { Navbar, Container, Button } from "react-bootstrap";

export const NavigationBar = ({
  isLoggedIn,
  onLogout,
  onHome,
  onShowLogin,
}) => {
  return (
    <Navbar className="custom-navbar">
      {/* Full-width outer bar */}
      <div className="w-100">
        {/* Constrained inner content */}
        <Container fluid="md" className="d-flex align-items-center">
          <Navbar.Brand
            onClick={onHome}
            className="brand-title"
          >
            My KDrama Movies
          </Navbar.Brand>

          <div className="ms-auto">
            {isLoggedIn ? (
              <Button
                variant="outline-secondary"
                size="sm"
                className="ui-btn"
                onClick={onLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outline-secondary"
                size="sm"
                className="ui-btn"
                onClick={onShowLogin}
              >
                Login
              </Button>
            )}
          </div>
        </Container>
      </div>
    </Navbar>
  );
};