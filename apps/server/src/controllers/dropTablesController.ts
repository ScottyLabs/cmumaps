import { Body, Delete, Route, Security } from "tsoa";
import { ADMIN_SCOPE, BEARER_AUTH, OIDC_AUTH } from "../lib/authentication.ts";
import { dropTablesService } from "../services/dropTablesService.ts";

@Security(OIDC_AUTH, [ADMIN_SCOPE])
@Security(BEARER_AUTH, [ADMIN_SCOPE])
@Route("drop-tables")
export class DropTablesController {
  @Delete("/")
  public async dropTables(@Body() body: { tableNames: string[] }) {
    const { tableNames } = body;
    await dropTablesService.dropTables(tableNames);
    return { message: `Tables dropped: ${tableNames.join(", ")}` };
  }
}
