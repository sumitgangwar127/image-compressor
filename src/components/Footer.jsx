import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-grid">
        <div className="foot-actions">
          <button
            className="btn btn-plain"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top
          </button>
        </div>

        <p className="foot-note">Processed locally in your browser. No uploads.</p>
        <div>
          <Link to="/privacy-policy">Privacy Policy</Link> |{" "}
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
