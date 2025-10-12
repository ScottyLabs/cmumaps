import { Body, Delete, Route, Security } from "tsoa";
import { ADMIN_SCOPE } from "../middleware/authentication";
import { dropTablesService } from "../services/dropTablesService";

@Security("oauth2", [ADMIN_SCOPE])
@Route("drop-tables")
export class DropTablesController {
  @Delete("/")
  async dropTables(@Body() body: { tableNames: string[] }) {
    const { tableNames } = body;
    await dropTablesService.dropTables(tableNames);
    return { message: `Tables dropped: ${tableNames.join(", ")}` };
  }
}
