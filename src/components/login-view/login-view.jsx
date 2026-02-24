import { useState } from "react";

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
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || `HTTP ${response.status}`);
        }

        if (!data?.token) {
          throw new Error("Login response did not include a token.");
        }

        onLoggedIn(data.user, data.token);
      })
      .catch((err) => {
        console.error("Login failed:", err);
        setError(String(err.message || err));
      });
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:{" "}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
        </div>

        <div>
          <label>
            Password:{" "}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">Login</button>
        </div>

        {error ? <div style={{ marginTop: "1rem" }}>Error: {error}</div> : null}
      </form>
    </div>
  );
};