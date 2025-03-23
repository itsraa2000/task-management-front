import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskDashboard from "../components/task-dashboard";

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = true; // Replace with real authentication logic

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return <TaskDashboard />;
};

export default Home;
