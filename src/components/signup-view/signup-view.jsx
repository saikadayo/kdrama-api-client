import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

export const SignupView = ({ apiUrl, onSignedUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!username || username.trim().length < 5)
      return "Username must be at least 5 characters.";
    if (!/^[a-z0-9]+$/i.test(username))
      return "Username must be alphanumeric.";
    if (!password) return "Password is required.";
    if (!email) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      return "Email does not appear to be valid.";
    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday || undefined,
      }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            data?.message ||
            data?.errors?.[0]?.msg ||
            `HTTP ${response.status}`;
          throw new Error(message);
        }

        setError("");
        setSuccess("Signup successful. You can now log in.");

        if (onSignedUp) onSignedUp();
      })
      .catch((err) => {
        console.error("Signup failed:", err);
        setError(String(err.message || err));
        setSuccess("");
      });
  };

  return (
    <div>
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="form-title">Sign Up</Card.Title>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="signupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              minLength={5}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="signupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="signupBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit"
              variant="outline-secondary"
              size="sm"
              className="ui-btn w-100"
            >
              Sign Up
            </Button>
          </div>

          {error && (
            <Alert variant="danger" className="mt-3 mb-0">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mt-3 mb-0">
              {success}
            </Alert>
          )}
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
};