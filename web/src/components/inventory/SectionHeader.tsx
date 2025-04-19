import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="section-header">
      <div className="section-content">
        <div className="section-text">{title}</div>
      </div>
    </div>
  );
};

export default SectionHeader;
