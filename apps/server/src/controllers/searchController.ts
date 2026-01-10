import { Get, Query, Route } from "tsoa";
import { searchService } from "../services/searchService.ts";
import type { Document } from "../utils/search/types.ts";

@Route("search")
export class SearchController {
  @Get("/")
  public async search(
    @Query() query: string,
    @Query() n?: number,
    @Query() lat?: number,
    @Query() lon?: number,
  ): Promise<Document[]> {
    return await searchService.search(query, n, lat, lon);
  }
}
