import { toast } from "react-toastify";

// error handling for queryFulfilled
export const handleQueryError = async (
  queryFulfilled: unknown,
  undo: () => void,
) => {
  try {
    await queryFulfilled;
  } catch (e) {
    if ((e as { error: { status: number } }).error.status === 404) {
      toast.error("You are not authorized to edit!");
    } else {
      toast.error("Failed to save! Check the Console for detailed error.");
    }
    undo();
    console.error(e);
  }
};
