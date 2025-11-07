import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/apiPaths";

const useNotification = () => {
  const token = localStorage.getItem("token");

  // clear notifications
  const { mutate: clearNotifications, isPending: loadingClearNotifications } =
    useMutation({
      mutationFn: async () => {
        const response = await axios.delete(
          BASE_URL + API_PATHS.NOTIFICATIONS.CLEAR,
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

  return { clearNotifications, loadingClearNotifications };
};

export default useNotification;
