import type { Request, Response } from 'express';
import { nodeService } from '../services/nodeService.ts';

export const nodeController = {
  getFloorNodes: async (req: Request, res: Response) => {
    const { floorCode } = req.params;
    const nodes = await nodeService.getFloorNodes(floorCode);
    res.json(nodes);
  },
};
