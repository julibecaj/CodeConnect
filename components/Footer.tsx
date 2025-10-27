import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="cc-footer">
      <div className="cc-container">
        <div className="cc-footer__grid">
          <div>
            <div className="cc-footer__brand">
              <div className="cc-logo cc-logo--footer">∞</div>
              <span className="cc-brand">CodeConnect</span>
            </div>
          </div>

          <div>
            <h5 className="cc-footer__title">The Team</h5>
            <ul className="cc-footer__list">
              <li><Link href="#">Who we are</Link></li>
              <li><Link href="#">The community</Link></li>
              <li><Link href="#">What we offer</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="cc-footer__title">Support</h5>
            <ul className="cc-footer__list">
              <li><Link href="#">Contact us</Link></li>
              <li><Link href="#">FAQs</Link></li>
              <li><Link href="#">Our vision</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="cc-footer__title">Socials</h5>
            <ul className="cc-footer__list">
              <li><Link href="#">LinkedIn</Link></li>
              <li><Link href="#">Instagram</Link></li>
              <li><Link href="#">@codeconnect.dev</Link></li>
            </ul>
          </div>
        </div>

        <div className="cc-footer__copy">
          All rights reserved ©2025-CodeConnect
        </div>
      </div>
    </footer>
  );
};

export default Footer;
