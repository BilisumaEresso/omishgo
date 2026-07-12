import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f7fa",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px 32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logoMain: {
    fontSize: "36px",
    fontWeight: "800",
    fontFamily: "system-ui, sans-serif",
  },
  logoGreen: { color: "#1A5C2A" },
  logoDark: { color: "#0D1F0F" },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginTop: "4px",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "16px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1A5C2A",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
  },
  error: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "16px",
  },
};

const Login = () => {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !pin) {
      return;
    }
    try {
      await login(phone.trim(), pin);
    } catch (err) {
      console.error(err);
      // Error is handled in the store
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logoMain}>
            <span style={styles.logoDark}>Omish</span>
            <span style={styles.logoGreen}>Go</span>
          </div>
          <div style={styles.subtitle}>Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <input
            style={styles.input}
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            disabled={loading}
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
