import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Button, Form, Alert } from "react-bootstrap";

export const ProfileView = ({
  apiUrl,
  token,
  user,
  onUserUpdated,
  onDeregister,
  movies,
  renderMovieCard,
}) => {
  const [profileUser, setProfileUser] = useState(null);

  const [username, setUsername] = useState(user?.Username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user?.Email || "");
  const [birthday, setBirthday] = useState(
    user?.Birthday ? String(user.Birthday).slice(0, 10) : ""
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    if (!token || !user?.Username) return;

    fetch(`${apiUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message || `HTTP ${res.status}`);
        }

        if (!Array.isArray(data)) {
          throw new Error("Users endpoint did not return an array.");
        }

        const found = data.find((u) => u.Username === user.Username);

        if (!found) {
          throw new Error("Could not find logged-in user in /users list.");
        }

        setProfileUser(found);

        setUsername(found.Username || "");
        setEmail(found.Email || "");
        setBirthday(found.Birthday ? String(found.Birthday).slice(0, 10) : "");

        setError("");
      })
      .catch((err) => {
        setError(String(err.message || err));
      });
  }, [apiUrl, token, user?.Username]);

  // ✅ IMPORTANT: favorites must come from `user` so the list updates immediately
  const favoriteMovies = useMemo(() => {
    const favIds = user?.FavoriteMovies || [];
    return movies.filter((m) => favIds.includes(m.id));
  }, [movies, user]);

  const handleUpdate = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const currentUsername = profileUser?.Username || user?.Username;
    if (!currentUsername) {
      setError("User not loaded yet.");
      return;
    }

    const payload = {
      Username: username,
      Email: email,
      Birthday: birthday || undefined,
    };

    if (password) payload.Password = password;

    fetch(`${apiUrl}/users/${currentUsername}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            data?.message || data?.errors?.[0]?.msg || `HTTP ${res.status}`;
          throw new Error(msg);
        }

        setSuccess("Profile updated.");
        setPassword("");

        const updatedUser = { ...(user || {}), ...(data || {}) };
        if (onUserUpdated) onUserUpdated(updatedUser);
      })
      .catch((err) => {
        setError(String(err.message || err));
      });
  };

  const handleDeregister = () => {
    setError("");
    setSuccess("");

    const currentUsername = profileUser?.Username || user?.Username;
    if (!currentUsername) {
      setError("User not loaded yet.");
      return;
    }

    const ok = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!ok) return;

    fetch(`${apiUrl}/users/${currentUsername}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message || `HTTP ${res.status}`);
        }

        if (onDeregister) onDeregister();
      })
      .catch((err) => {
        setError(String(err.message || err));
      });
  };

  return (
    <Row className="g-4">
      <Col xs={12} lg={4}>
        <Card>
          <Card.Body>
            <Card.Title className="movie-title">Profile</Card.Title>

            {error ? (
              <Alert variant="danger" className="mt-3">
                Error: {error}
              </Alert>
            ) : null}

            {success ? (
              <Alert variant="success" className="mt-3">
                {success}
              </Alert>
            ) : null}

            <div className="text-muted mt-2">
              {profileUser ? (
                <>
                  <div>
                    <strong>Username:</strong> {profileUser.Username}
                  </div>
                  {profileUser.Email ? (
                    <div>
                      <strong>Email:</strong> {profileUser.Email}
                    </div>
                  ) : null}
                  {profileUser.Birthday ? (
                    <div>
                      <strong>Birthday:</strong>{" "}
                      {String(profileUser.Birthday).slice(0, 10)}
                    </div>
                  ) : null}
                </>
              ) : (
                <div>Loading user...</div>
              )}
            </div>

            <hr className="my-4" />

            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="Leave blank to keep current"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Birthday</Form.Label>
                <Form.Control
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  variant="outline-secondary"
                  size="sm"
                  className="ui-btn w-100"
                >
                  Update Profile
                </Button>

                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  className="ui-btn w-100"
                  onClick={handleDeregister}
                >
                  Deregister
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} lg={8}>
        <Card>
          <Card.Body>
            <Card.Title className="movie-title">Favorite Movies</Card.Title>

            {favoriteMovies.length === 0 ? (
              <div className="text-muted mt-2">No favorites yet.</div>
            ) : null}

            <Row className="g-3 mt-2">
              {favoriteMovies.map((m) => {
                const isRemoving = removingIds.includes(m.id);

                return (
                  <Col
                    key={m.id}
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xxl={3}
                    style={{
                      opacity: isRemoving ? 0 : 1,
                      transform: isRemoving ? "scale(0.98)" : "scale(1)",
                      transition: "opacity 180ms ease, transform 180ms ease",
                    }}
                  >
                    {renderMovieCard
                      ? renderMovieCard(m, {
                          onBeforeUnfavorite: () => {
                            setRemovingIds((prev) =>
                              prev.includes(m.id) ? prev : [...prev, m.id]
                            );
                          },
                          onAfterUnfavorite: () => {
                            setTimeout(() => {
                              setRemovingIds((prev) =>
                                prev.filter((id) => id !== m.id)
                              );
                            }, 220);
                          },
                        })
                      : null}
                  </Col>
                );
              })}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

ProfileView.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object,
  onUserUpdated: PropTypes.func,
  onDeregister: PropTypes.func,
  movies: PropTypes.array.isRequired,
  renderMovieCard: PropTypes.func,
};