import React from 'react';

interface Title {
  title?: string;
  subtitle?: string;
}

const Title: React.FC<Title> = ({ title = 'INVENTORY', subtitle = 'Your personal storage' }) => {
  return (
    <div className="miami-title">
      <div className="title-text">{title}</div>
      <div className="subtitle-text">{subtitle}</div>
    </div>
  );
};

export default Title;
