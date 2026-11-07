import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-primary-950 via-primary-950 to-primary-950 text-white py-2">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs text-center opacity-80 mb-2 text-white">
          © {new Date().getFullYear()} E-Visitors System. All rights reserved.||
          Powered by SANTECH.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
