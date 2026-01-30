import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const AuthLoader = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return children;
};

export default AuthLoader;