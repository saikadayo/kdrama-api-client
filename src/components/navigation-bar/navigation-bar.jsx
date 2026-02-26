import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export const NavigationBar = ({
  isLoggedIn,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <Navbar className="custom-navbar">
      <div className="w-100">
        <Container fluid="md" className="d-flex align-items-center">
          <Navbar.Brand
            as={Link}
            to={isLoggedIn ? "/" : "/login"}
            className="brand-title"
          >
            My KDrama Movies
          </Navbar.Brand>

          <Nav className="ms-auto">
            {!isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="nav-btn"
                >
                  Login
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/signup"
                  className="nav-btn"
                >
                  Signup
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className="nav-btn"
                >
                  Home
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/profile"
                  className="nav-btn"
                >
                  Profile
                </Nav.Link>

                <Nav.Link
                  onClick={handleLogout}
                  className="nav-btn"
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </div>
    </Navbar>
  );
};