import React from 'react';

const SocialAuthButtons: React.FC = () => {
  return (
    <div className="social-auth">
      <button className="btn-social google">
        Continue with Google
      </button>
      <button className="btn-social facebook">
        Continue with Facebook
      </button>
    </div>
  );
};

export default SocialAuthButtons;
