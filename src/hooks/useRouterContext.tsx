
import { useLocation, useNavigate } from 'react-router-dom';

export const useRouterContext = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return {
    path: location.pathname,
    navigate,
    goBack: () => navigate(-1)
  };
};
