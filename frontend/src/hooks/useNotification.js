import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useNotification = () => {
  const token = localStorage.getItem("token");

  // clear notifications
  const { mutate: clearNotifications, isPending: loadingClearNotifications } =
    useMutation({
      mutationFn: async () => {
        const response = await axios.delete(
          `http://localhost:5000/api/notifications/clearNotifications`,
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
