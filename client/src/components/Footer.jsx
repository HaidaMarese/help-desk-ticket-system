export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <strong>HelpDesk Pro</strong>
          <p>Enterprise IT support ticket management.</p>
        </div>

        <div className="footer-links">
          <span>React</span>
          <span>Node.js</span>
          <span>Express</span>
          <span>MongoDB</span>
        </div>
      </div>

      <div className="footer-bottom">
        © {currentYear} HelpDesk Pro. Built by Haida Makouangou.
      </div>
    </footer>
  );
}