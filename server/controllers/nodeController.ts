import type { Request, Response } from 'express';
import { nodeService } from '../services/nodeService.ts';

export const nodeController = {
  getFloorNodes: async (req: Request, res: Response) => {
    const { floorCode } = req.query;

    if (!floorCode) {
      res.status(400).json({ message: 'floorCode is required' });
      return;
    }

    const nodes = await nodeService.getFloorNodes(floorCode as string);
    res.json(nodes);
  },

  createNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;

    try {
      await nodeService.createNode(floorCode, nodeId, nodeInfo);
      res.json(null);
    } catch (error) {
      console.error('Error creating node', error);
      res.status(500).json({
        error: 'Error creating node',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
