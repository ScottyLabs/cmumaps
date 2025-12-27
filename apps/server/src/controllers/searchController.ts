import { Get, Query, Route, Security } from "tsoa";
import {
  BEARER_AUTH,
  MEMBER_SCOPE,
} from "../middleware/authentication";
import { searchService } from "../services/searchService";
import type { Document } from "../utils/search/types";

@Route("search")
export class SearchController {
  @Get("/")
  public async search(
    @Query() query: string,
    @Query() n?: number,
    @Query() lat?: number,
    @Query() lon?: number,
  ): Promise<Document[]> {
    return searchService.search(query, n, lat, lon);
  }

  @Get("/rebuild")
  @Security(BEARER_AUTH, [MEMBER_SCOPE])
  public async rebuildIndex(): Promise<{
    message: string;
    documentCount: number;
  }> {
    return searchService.rebuildSearchContext();
  }
}
