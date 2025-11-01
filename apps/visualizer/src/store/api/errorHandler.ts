import { toast } from "react-toastify";

// error handling for queryFulfilled
export const handleQueryError = async (
  queryFulfilled: unknown,
  undo: () => void,
  successMessage?: string,
) => {
  try {
    await queryFulfilled;
    if (successMessage) {
      toast.success(successMessage);
    }
  } catch (e) {
    if ((e as { error: { status: number } }).error.status === 401) {
      toast.error("You are not authorized to edit!");
    } else {
      toast.error("Failed to save! Check the Console for detailed error.");
    }
    undo();
    console.error(e);
  }
};
