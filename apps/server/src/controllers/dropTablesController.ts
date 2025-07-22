import { Body, Delete, Route, Security } from "tsoa";
import { dropTablesService } from "../services/dropTablesService";

@Route("drop-tables")
export class DropTablesController {
  @Security("oauth2", ["db_admin"])
  @Delete("/")
  async dropTables(@Body() body: { tableNames: string[] }) {
    const { tableNames } = body;
    await dropTablesService.dropTables(tableNames);
  }
}
