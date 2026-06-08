import { Navigate } from "react-router-dom";


function ProtectedRoute({children}) {

    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if(!user) {
        return (<Navigate to ="/" />);
    }

    return children;
}

export default ProtectedRoute;