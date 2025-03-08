import { toast } from "react-toastify";

import {
  CreatePoiPayload,
  DeletePoiPayload,
  UpdatePoiPayload,
} from "../../../../shared/websocket-types/poiTypes";
import { getSocketId } from "../middleware/webSocketMiddleware";
import { AppDispatch } from "../store";
import { apiSlice, BaseMutationArg } from "./apiSlice";
import { handleQueryError } from "./errorHandler";
import { floorDataApiSlice } from "./floorDataApiSlice";

export type CreatePoiArg = BaseMutationArg & CreatePoiPayload;
export type DeletePoiArg = BaseMutationArg & DeletePoiPayload;
export type UpdatePoiArg = BaseMutationArg & UpdatePoiPayload;

export const createPoi =
  (floorCode: string, { poiId, poiType }: CreatePoiPayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorPois",
        floorCode,
        (draft) => {
          draft[poiId] = poiType;
        },
      ),
    );

export const deletePoi =
  (floorCode: string, { poiId }: DeletePoiPayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorPois",
        floorCode,
        (draft) => {
          delete draft[poiId];
        },
      ),
    );

export const updatePoi =
  (floorCode: string, { poiId, poiType }: UpdatePoiPayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorPois",
        floorCode,
        (draft) => {
          draft[poiId] = poiType;
        },
      ),
    );

export const poiApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createPoi: builder.mutation<Response, CreatePoiArg>({
      query: ({ floorCode, poiId, poiType }) => ({
        url: `/pois/${poiId}`,
        method: "POST",
        body: { floorCode, poiType },
        headers: {
          "X-Socket-ID": getSocketId(),
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, poiId, poiType, batchId } = arg;
          // add to history
          if (batchId) {
            // const editPair = buildCreateRoomEditPair(batchId, arg);
            // dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(createPoi(floorCode, { poiId, poiType }));
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),

    deletePoi: builder.mutation<Response, DeletePoiArg>({
      query: ({ floorCode, poiId }) => ({
        url: `/pois/${poiId}`,
        method: "DELETE",
        body: { floorCode },
        headers: {
          "X-Socket-ID": getSocketId(),
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, poiId, batchId } = arg;
          // add to history
          if (batchId) {
            // const editPair = buildDeleteRoomEditPair(batchId, arg);
            // dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(deletePoi(floorCode, { poiId }));
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    updatePoi: builder.mutation<Response, UpdatePoiArg>({
      query: ({ floorCode, poiId, poiType }) => ({
        url: `/pois/${poiId}`,
        method: "PUT",
        body: { floorCode, poiType },
        headers: {
          "X-Socket-ID": getSocketId(),
        },
      }),
      onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, poiId, poiType, batchId } = arg;
          // add to history
          if (batchId) {
            // const editPair = buildCreateRoomEditPair(batchId, arg);
            // dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(updatePoi(floorCode, { poiId, poiType }));
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
  useCreatePoiMutation,
  useDeletePoiMutation,
  useUpdatePoiMutation,
} = poiApiSlice;
