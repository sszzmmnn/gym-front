import { useContext } from "react";
import UserContext from "../contexts/UserProvider";

const useUser = () => {
    return useContext(UserContext);
}

export default useUser;