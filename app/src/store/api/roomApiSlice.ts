import { toast } from "react-toastify";

import {
  CreateRoomPayload,
  DeleteRoomPayload,
  UpdateRoomPayload,
} from "../../../../shared/websocket-types/roomTypes";
import {
  buildCreateRoomEditPair,
  buildDeleteRoomEditPair,
  buildUpdateRoomEditPair,
} from "../features/history/historyRoomUtils";
import { addEditToHistory } from "../features/history/historySlice";
import { getSocketId } from "../middleware/webSocketMiddleware";
import { AppDispatch, RootState } from "../store";
import { apiSlice, BaseMutationArg } from "./apiSlice";
import { handleQueryError } from "./errorHandler";
import { floorDataApiSlice } from "./floorDataApiSlice";

export type CreateRoomArg = BaseMutationArg & CreateRoomPayload;
export type DeleteRoomArg = BaseMutationArg & DeleteRoomPayload;
export type UpdateRoomArg = BaseMutationArg & UpdateRoomPayload;

export const createRoom =
  (floorCode: string, { roomId, roomInfo }: CreateRoomPayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorRooms",
        floorCode,
        (draft) => {
          draft[roomId] = roomInfo;
        },
      ),
    );

export const deleteRoom =
  (floorCode: string, { roomId }: DeleteRoomPayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorRooms",
        floorCode,
        (draft) => {
          delete draft[roomId];
        },
      ),
    );

export const updateRoom =
  (floorCode: string, { roomId, roomInfo }: UpdateRoomPayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorRooms",
        floorCode,
        (draft) => {
          draft[roomId] = { ...draft[roomId], ...roomInfo };
        },
      ),
    );

export const roomApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createRoom: builder.mutation<Response, CreateRoomArg>({
      query: ({ floorCode, roomId, roomInfo }) => ({
        url: `/rooms/${roomId}`,
        method: "POST",
        body: { floorCode, roomInfo },
        headers: {
          "X-Socket-ID": getSocketId(),
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, roomId, roomInfo, batchId } = arg;
          // add to history
          if (batchId) {
            const editPair = buildCreateRoomEditPair(batchId, arg);
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            createRoom(floorCode, { roomId, roomInfo }),
          );
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    deleteRoom: builder.mutation<Response, DeleteRoomArg>({
      query: ({ roomId }) => ({
        url: `/rooms/${roomId}`,
        method: "DELETE",
        headers: {
          "X-Socket-ID": getSocketId(),
        },
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        try {
          const { floorCode, roomId, batchId } = arg;
          // add to history
          if (batchId) {
            const getStore = getState as () => RootState;
            const editPair = await buildDeleteRoomEditPair(
              batchId,
              arg,
              getStore,
              dispatch,
            );
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(deleteRoom(floorCode, { roomId }));
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    updateRoom: builder.mutation<Response, UpdateRoomArg>({
      query: ({ floorCode, roomId, roomInfo }) => ({
        url: `/rooms/${roomId}`,
        method: "PATCH",
        body: { floorCode, roomInfo },
        headers: {
          "X-Socket-ID": getSocketId(),
        },
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        try {
          const { floorCode, roomId, roomInfo, batchId } = arg;
          // add to history
          if (batchId) {
            const getStore = getState as () => RootState;
            const editPair = await buildUpdateRoomEditPair(
              batchId,
              arg,
              getStore,
              dispatch,
            );
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            updateRoom(floorCode, { roomId, roomInfo }),
          );
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useUpdateRoomMutation,
} = roomApiSlice;
