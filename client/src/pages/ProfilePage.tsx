import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
