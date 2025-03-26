import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <div className="w-24 h-1 bg-primary my-8"></div>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link to="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/blogs">Browse Blogs</Link>
        </Button>
      </div>
    </div>
  );
}
