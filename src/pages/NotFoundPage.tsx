import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-2">Oops! The page you're looking for doesn't exist.</p>
      <p className="text-gray-500 mb-6">It might have been moved or deleted.</p>
      <Button asChild>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;