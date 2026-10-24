import { useContext, useEffect } from 'react'
import { dataContext } from '../../dataProvider/DataProvider'
import { useNavigate } from 'react-router-dom';

function ProtectedRoutes({ children, message, redirect }) {
  const [{ user }, dispatch] = useContext(dataContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        state: {
          message,
          redirect
      }})
    }
  }, [message, navigate, redirect, user])
  if (!user) {
    return null; 
  }
  return children;
}

export default ProtectedRoutes