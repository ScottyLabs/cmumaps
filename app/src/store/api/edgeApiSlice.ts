import {
  CreateEdgeAcrossFloorsPayload,
  CreateEdgePayload,
  DeleteEdgeAcrossFloorsPayload,
  DeleteEdgePayload,
} from "@cmumaps/shared/websocket-types/edgeTypes";

import { toast } from "react-toastify";

import {
  buildCreateEdgeAcrossFloorsEditPair,
  buildCreateEdgeEditPair,
  buildDeleteEdgeAcrossFloorsEditPair,
  buildDeleteEdgeEditPair,
} from "../features/history/historyGraphUtils";
import { addEditToHistory } from "../features/history/historySlice";
import { getSocketId } from "../middleware/webSocketMiddleware";
import { AppDispatch } from "../store";
import { apiSlice, BaseMutationArg } from "./apiSlice";
import { handleQueryError } from "./errorHandler";
import { floorDataApiSlice } from "./floorDataApiSlice";

export type CreateEdgeArg = BaseMutationArg & CreateEdgePayload;
export type DeleteEdgeArg = BaseMutationArg & DeleteEdgePayload;
export type CreateEdgeAcrossFloorsArg = BaseMutationArg &
  CreateEdgeAcrossFloorsPayload;
export type DeleteEdgeAcrossFloorsArg = BaseMutationArg &
  DeleteEdgeAcrossFloorsPayload;

export const createEdge =
  (floorCode: string, { inNodeId, outNodeId }: CreateEdgePayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        floorCode,
        (draft) => {
          draft[inNodeId].neighbors[outNodeId] = {};
          draft[outNodeId].neighbors[inNodeId] = {};
        },
      ),
    );

export const deleteEdge =
  (floorCode: string, { inNodeId, outNodeId }: CreateEdgePayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        floorCode,
        (draft) => {
          delete draft[inNodeId].neighbors[outNodeId];
          delete draft[outNodeId].neighbors[inNodeId];
        },
      ),
    );

export const createEdgeAcrossFloors =
  (
    floorCode: string,
    { outFloorCode, inNodeId, outNodeId }: CreateEdgeAcrossFloorsPayload,
  ) =>
  (dispatch: AppDispatch) => {
    const { undo: inUndo } = dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        floorCode,
        (draft) => {
          draft[inNodeId].neighbors[outNodeId] = { outFloorCode };
        },
      ),
    );

    const { undo: outUndo } = dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        outFloorCode,
        (draft) => {
          draft[outNodeId].neighbors[inNodeId] = { outFloorCode: floorCode };
        },
      ),
    );

    return {
      undo: () => {
        inUndo();
        outUndo();
      },
    };
  };

export const deleteEdgeAcrossFloors =
  (
    floorCode: string,
    { outFloorCode, inNodeId, outNodeId }: DeleteEdgeAcrossFloorsPayload,
  ) =>
  (dispatch: AppDispatch) => {
    const { undo: inUndo } = dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        floorCode,
        (draft) => {
          delete draft[inNodeId].neighbors[outNodeId];
        },
      ),
    );

    const { undo: outUndo } = dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        outFloorCode,
        (draft) => {
          delete draft[outNodeId].neighbors[inNodeId];
        },
      ),
    );

    return {
      undo: () => {
        inUndo();
        outUndo();
      },
    };
  };

export const edgeApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createEdge: builder.mutation<Response, CreateEdgeArg>({
      query: ({ floorCode, inNodeId, outNodeId }) => ({
        url: "edge",
        method: "POST",
        body: { floorCode, inNodeId, outNodeId },
        headers: { "X-Socket-ID": getSocketId() },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, inNodeId, outNodeId, batchId } = arg;
          // add to history
          if (batchId) {
            const editPair = buildCreateEdgeEditPair(batchId, arg);
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            createEdge(floorCode, { inNodeId, outNodeId }),
          );
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    deleteEdge: builder.mutation<Response, DeleteEdgeArg>({
      query: ({ floorCode, inNodeId, outNodeId }) => ({
        url: "edge",
        method: "DELETE",
        body: { floorCode, inNodeId, outNodeId },
        headers: { "X-Socket-ID": getSocketId() },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, inNodeId, outNodeId, batchId } = arg;
          // add to history
          if (batchId) {
            const editPair = buildDeleteEdgeEditPair(batchId, arg);
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            deleteEdge(floorCode, { inNodeId, outNodeId }),
          );
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    createEdgeAcrossFloors: builder.mutation<
      Response,
      CreateEdgeAcrossFloorsArg
    >({
      query: ({ floorCode, outFloorCode, inNodeId, outNodeId }) => ({
        url: "cross-floor-edge",
        method: "POST",
        body: { floorCode, outFloorCode, inNodeId, outNodeId },
        headers: { "X-Socket-ID": getSocketId() },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, outFloorCode, inNodeId, outNodeId, batchId } = arg;
          // add to history
          if (batchId) {
            const editPair = buildCreateEdgeAcrossFloorsEditPair(batchId, arg);
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            createEdgeAcrossFloors(floorCode, {
              outFloorCode,
              inNodeId,
              outNodeId,
            }),
          );
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    deleteEdgeAcrossFloors: builder.mutation<
      Response,
      DeleteEdgeAcrossFloorsArg
    >({
      query: ({ floorCode, outFloorCode, inNodeId, outNodeId }) => ({
        url: "cross-floor-edge",
        method: "DELETE",
        body: { floorCode, outFloorCode, inNodeId, outNodeId },
        headers: { "X-Socket-ID": getSocketId() },
      }),
      onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, outFloorCode, inNodeId, outNodeId, batchId } = arg;
          // add to history
          if (batchId) {
            const editPair = buildDeleteEdgeAcrossFloorsEditPair(batchId, arg);
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            deleteEdgeAcrossFloors(floorCode, {
              outFloorCode,
              inNodeId,
              outNodeId,
            }),
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
  useCreateEdgeMutation,
  useDeleteEdgeMutation,
  useCreateEdgeAcrossFloorsMutation,
  useDeleteEdgeAcrossFloorsMutation,
} = edgeApiSlice;
