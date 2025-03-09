import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSummaryAnalytics } from '@/lib/hooks/useAnalytics';

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSummaryAnalytics hook', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ analytics: { tasks: { completion: 80 } } })
      })
    ) as jest.Mock;
  });
  
  it('returns analytics data', async () => {
    const { result, waitFor } = renderHook(() => useSummaryAnalytics(), {
      wrapper: createWrapper()
    });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({ tasks: { completion: 80 } });
  });
});
