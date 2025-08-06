import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../../../backend/config/apiPaths";

export const useUser = () => {
  const token = localStorage.getItem("token");
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get(BASE_URL + API_PATHS.ME.GET, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
  });

  return { user, isPending, error, isAuthenticated: !!token };
};
