import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">Page Not Found</h1>
        <p className="text-secondary-600 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
