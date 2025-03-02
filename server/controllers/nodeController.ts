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
};
