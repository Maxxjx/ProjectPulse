import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, description }) => {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );
};

export default PageTitle;
