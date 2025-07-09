/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FloorController } from './../src/controllers/floorController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BuildingController } from './../src/controllers/buildingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../src/controllers/authController';
import { expressAuthentication } from './../src/middleware/authentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "GeoCoordinate": {
        "dataType": "refObject",
        "properties": {
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Floor": {
        "dataType": "refObject",
        "properties": {
            "buildingCode": {"dataType":"string","required":true},
            "level": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoomType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":[""]},{"dataType":"enum","enums":["Default"]},{"dataType":"enum","enums":["Corridor"]},{"dataType":"enum","enums":["Auditorium"]},{"dataType":"enum","enums":["Office"]},{"dataType":"enum","enums":["Classroom"]},{"dataType":"enum","enums":["Operational"]},{"dataType":"enum","enums":["Conference"]},{"dataType":"enum","enums":["Study"]},{"dataType":"enum","enums":["Laboratory"]},{"dataType":"enum","enums":["Computer Lab"]},{"dataType":"enum","enums":["Studio"]},{"dataType":"enum","enums":["Workshop"]},{"dataType":"enum","enums":["Vestibule"]},{"dataType":"enum","enums":["Storage"]},{"dataType":"enum","enums":["Restroom"]},{"dataType":"enum","enums":["Stairs"]},{"dataType":"enum","enums":["Elevator"]},{"dataType":"enum","enums":["Ramp"]},{"dataType":"enum","enums":["Dining"]},{"dataType":"enum","enums":["Food"]},{"dataType":"enum","enums":["Store"]},{"dataType":"enum","enums":["Library"]},{"dataType":"enum","enums":["Sport"]},{"dataType":"enum","enums":["Parking"]},{"dataType":"enum","enums":["Inaccessible"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GeoRoom": {
        "dataType": "refObject",
        "properties": {
            "labelPosition": {"ref":"GeoCoordinate","required":true},
            "floor": {"ref":"Floor","required":true},
            "type": {"ref":"RoomType","required":true},
            "alias": {"dataType":"string"},
            "points": {"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GeoCoordinate"}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.GeoRoom_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"GeoRoom"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GeoRooms": {
        "dataType": "refAlias",
        "type": {"ref":"Record_string.GeoRoom_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Building": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "isMapped": {"dataType":"boolean","required":true},
            "defaultOrdinal": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "defaultFloor": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "floors": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "labelLatitude": {"dataType":"double","required":true},
            "labelLongitude": {"dataType":"double","required":true},
            "shape": {"dataType":"array","array":{"dataType":"array","array":{"dataType":"refObject","ref":"GeoCoordinate"}},"required":true},
            "hitbox": {"dataType":"array","array":{"dataType":"refObject","ref":"GeoCoordinate"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.Building_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"Building"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Buildings": {
        "dataType": "refAlias",
        "type": {"ref":"Record_string.Building_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsFloorController_getFloorplan: Record<string, TsoaRoute.ParameterSchema> = {
                floorCode: {"in":"path","name":"floorCode","required":true,"dataType":"string"},
        };
        app.get('/floors/:floorCode/floorplan',
            authenticateMiddleware([{"oauth2":[]}]),
            ...(fetchMiddlewares<RequestHandler>(FloorController)),
            ...(fetchMiddlewares<RequestHandler>(FloorController.prototype.getFloorplan)),

            async function FloorController_getFloorplan(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFloorController_getFloorplan, request, response });

                const controller = new FloorController();

              await templateService.apiHandler({
                methodName: 'getFloorplan',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBuildingController_getBuildings: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/buildings',
            ...(fetchMiddlewares<RequestHandler>(BuildingController)),
            ...(fetchMiddlewares<RequestHandler>(BuildingController.prototype.getBuildings)),

            async function BuildingController_getBuildings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBuildingController_getBuildings, request, response });

                const controller = new BuildingController();

              await templateService.apiHandler({
                methodName: 'getBuildings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBuildingController_getDefaultFloor: Record<string, TsoaRoute.ParameterSchema> = {
                buildingCode: {"in":"path","name":"buildingCode","required":true,"dataType":"string"},
        };
        app.get('/buildings/:buildingCode/default-floor',
            ...(fetchMiddlewares<RequestHandler>(BuildingController)),
            ...(fetchMiddlewares<RequestHandler>(BuildingController.prototype.getDefaultFloor)),

            async function BuildingController_getDefaultFloor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBuildingController_getDefaultFloor, request, response });

                const controller = new BuildingController();

              await templateService.apiHandler({
                methodName: 'getDefaultFloor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_userInfo: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/auth/userInfo',
            authenticateMiddleware([{"oauth2":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.userInfo)),

            async function AuthController_userInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_userInfo, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'userInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
