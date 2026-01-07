import { Get, Query, Route } from "tsoa";
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
}
