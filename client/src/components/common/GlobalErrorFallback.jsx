 
export default function GlobalErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="flex max-w-md flex-col items-center justify-center space-y-4 rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong.</h2>
        <p className="text-gray-500">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>
        
        {/* Development only error message */}
        {import.meta.env.MODE === 'development' && (
          <div className="w-full rounded bg-red-50 p-3 text-left text-sm text-red-700 overflow-auto max-h-32">
            <strong>Error details:</strong>
            <pre className="mt-1 whitespace-pre-wrap">{error.message}</pre>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go to Home
          </button>
          <button
            onClick={resetErrorBoundary}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
