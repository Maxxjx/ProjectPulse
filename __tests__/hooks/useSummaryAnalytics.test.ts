import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
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
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ tasks: { completion: 80 } }),
            })
        );
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Ensures fetch mock doesn't affect other tests
    });

    it('returns analytics data', async () => {
        const { result } = renderHook(() => useSummaryAnalytics(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual({ tasks: { completion: 80 } });
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it('handles loading state', async () => {
        const { result } = renderHook(() => useSummaryAnalytics(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.isSuccess).toBe(true);
        });
    });

    it('handles error state', async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
            Promise.resolve({ ok: false })
        );

        const { result } = renderHook(() => useSummaryAnalytics(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.error).toBeDefined(); // Ensures error is not null
    });
});
