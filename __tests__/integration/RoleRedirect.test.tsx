import React from 'react';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import AdminDashboard from '@/app/dashboard/admin/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('Admin Dashboard access', () => {
  it('redirects non-admin users', () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    
    // Simulate non-admin session
    render(
      <SessionProvider session={{ user: { role: 'team' } } as any}>
        <AdminDashboard />
      </SessionProvider>
    );

    // Expect redirection message or element based on your implementation
    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });
});