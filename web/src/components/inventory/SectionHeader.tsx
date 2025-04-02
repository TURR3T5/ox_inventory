import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, icon }) => {
  return (
    <div className="section-header">
      <div className="section-icon">{icon}</div>
      <div className="section-content">
        <div className="section-text">{title}</div>
        {description && <div className="section-description">{description}</div>}
      </div>
    </div>
  );
};

export default SectionHeader;
