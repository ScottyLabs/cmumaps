import { toast } from "react-toastify";

// error handling for queryFulfilled
export const handleQueryError = async (
  queryFulfilled: unknown,
  undo: () => void,
) => {
  try {
    await queryFulfilled;
  } catch (e) {
    toast.error("Failed to save! Check the Console for detailed error.");
    undo();
    const error = e as { error: { data: { error: string; details: string } } };
    console.error(error.error.data.error);
    console.error("Error details:", error.error.data.details);
  }
};
