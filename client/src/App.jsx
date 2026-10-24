import { useContext, useEffect } from "react";
import Router from "./Router";
import { dataContext } from "./dataProvider/DataProvider";
import { type } from "./Utility/actionType";

const App = () => {
  const [state, dispatch] = useContext(dataContext);
  useEffect(() => {
    const user = localStorage.getItem("user") || null;

    if (user) {
      dispatch({
        type: type.SET_USER,
        user: JSON.parse(user),
      });
    }
  }, [dispatch]);
  return (
    <>
      <Router />
    </>
  );
};

export default App;
