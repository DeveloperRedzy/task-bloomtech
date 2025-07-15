/**
 * Not Found Page
 *
 * 404 error page for unmatched routes.
 */

const NotFoundPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div>
          <h1 className='text-6xl font-bold text-gray-900'>404</h1>
          <h2 className='mt-4 text-2xl font-bold text-gray-900'>
            Page not found
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className='mt-6'>
            <a
              href='/dashboard'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
            >
              Go back home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
