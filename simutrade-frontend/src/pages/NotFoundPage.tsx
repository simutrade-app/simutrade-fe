import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import '../styles/error-and-loading.css'; // Pastikan path ini benar atau styling diimpor secara global

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="mt-4 text-4xl font-semibold text-foreground">
        Oops! Page Not Found.
      </h2>
      <p className="mt-2 max-w-lg text-lg text-muted-foreground">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Button asChild variant="default" className="mt-8 px-6 py-3 text-lg hover:bg-primary hover:text-white">
        <Link to="/">Go to Homepage</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
