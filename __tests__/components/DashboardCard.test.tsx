import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardCard from '@/components/DashboardCard';

describe('DashboardCard component', () => {
  it('renders the title and progress correctly', () => {
    render(<DashboardCard title="Tasks Completed" progress={75} />);
    expect(screen.getByText(/Tasks Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/75%/i)).toBeInTheDocument();
  });
});