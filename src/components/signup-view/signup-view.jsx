import { useState } from "react";

export const SignupView = ({ apiUrl, onSignedUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!username || username.trim().length < 5) return "Username must be at least 5 characters.";
    if (!/^[a-z0-9]+$/i.test(username)) return "Username must be alphanumeric.";
    if (!password) return "Password is required.";
    if (!email) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Email does not appear to be valid.";
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
          // your API sometimes returns text, sometimes JSON
          const message = data?.message || data?.errors?.[0]?.msg || `HTTP ${response.status}`;
          throw new Error(message);
        }

        setError("");
        setSuccess("Signup successful. You can now log in.");

        // send them back to login after a successful signup
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
      <h2>Sign up</h2>

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
              autoComplete="new-password"
            />
          </label>
        </div>

        <div>
          <label>
            Email:{" "}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
        </div>

        <div>
          <label>
            Birthday:{" "}
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">Sign up</button>
        </div>

        {error ? <div style={{ marginTop: "1rem" }}>Error: {error}</div> : null}
        {success ? <div style={{ marginTop: "1rem" }}>{success}</div> : null}
      </form>
    </div>
  );
};