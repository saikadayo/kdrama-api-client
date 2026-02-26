import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

export const LoginView = ({ apiUrl, onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!username || username.trim().length < 1) return "Username is required.";
    if (!password || password.length < 1) return "Password is required.";
    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
      }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const msg = data?.message || "Invalid username or password.";
          throw new Error(msg);
        }

        if (!data?.token) {
          throw new Error("Login response did not include a token.");
        }

        onLoggedIn(data.user, data.token);
      })
      .catch((err) => {
        // No console.error here — expected auth failures shouldn't trigger the dev overlay
        setError(String(err.message || err));
      });
  };

  return (
    <div>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="form-title">Login</Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                type="submit"
                variant="outline-secondary"
                size="sm"
                className="ui-btn w-100"
              >
                Login
              </Button>
            </div>

            {error && (
              <Alert variant="danger" className="mt-3 mb-0">
                {error}
              </Alert>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};