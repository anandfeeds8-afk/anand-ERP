import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const useMessages = () => {
  const token = localStorage.getItem("token");

  // GET all admins
  const { data: admins, isPending: loadingAdmins } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await axios.get(
        BASE_URL + API_PATHS.MESSAGES.GET_ALL_ADMINS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { admins, loadingAdmins };
};

export default useMessages;
