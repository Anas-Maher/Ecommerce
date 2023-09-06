import { InferSchemaType, Types } from "mongoose";
import * as core from "express-serve-static-core";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import * as bodyParser from "body-parser";
import { users_schema } from "../db/models/users-models.js";
import { category_schema } from "../db/models/category-model.js";
global {
    export declare namespace Express {
        /**
         * This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
         * @since 4.16.0
         */
        var json: typeof bodyParser.json;

        /**
         * This is a built-in middleware function in Express. It parses incoming requests with Buffer payloads and is based on body-parser.
         * @since 4.17.0
         */
        var raw: typeof bodyParser.raw;

        /**
         * This is a built-in middleware function in Express. It parses incoming requests with text payloads and is based on body-parser.
         * @since 4.17.0
         */
        var text: typeof bodyParser.text;

        /**
         * These are the exposed prototypes.
         */
        var application: Application;
        var request: Request;
        var response: Response;

        /**
         * This is a built-in middleware function in Express. It serves static files and is based on serve-static.
         */
        var static: serveStatic.RequestHandlerConstructor<Response>;

        /**
         * This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
         * @since 4.16.0
         */
        var urlencoded: typeof bodyParser.urlencoded;

        /**
         * This is a built-in middleware function in Express. It parses incoming request query parameters.
         */
        export function query(
            options: qs.IParseOptions | typeof qs.parse
        ): Handler;

        export function Router(options?: RouterOptions): core.Router;

        interface RouterOptions {
            /**
             * Enable case sensitivity.
             */
            caseSensitive?: boolean | undefined;

            /**
             * Preserve the req.params values from the parent router.
             * If the parent and the child have conflicting param names, the child’s value take precedence.
             *
             * @default false
             * @since 4.5.0
             */
            mergeParams?: boolean | undefined;

            /**
             * Enable strict routing.
             */
            strict?: boolean | undefined;
        }

        interface Application extends core.Application {}
        interface CookieOptions extends core.CookieOptions {}
        interface Errback extends core.Errback {}
        interface ErrorRequestHandler<
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = core.Query,
            Locals extends Record<string, any> = Record<string, any>
        > extends core.ErrorRequestHandler<
                P,
                ResBody,
                ReqBody,
                ReqQuery,
                Locals
            > {}
        interface Express extends core.Express {}
        interface Handler extends core.Handler {}
        interface IRoute extends core.IRoute {}
        interface IRouter extends core.IRouter {}
        interface IRouterHandler<T> extends core.IRouterHandler<T> {}
        interface IRouterMatcher<T> extends core.IRouterMatcher<T> {}
        interface MediaType extends core.MediaType {}
        interface NextFunction extends core.NextFunction {}
        interface Locals extends core.Locals {}
        interface Request<
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = core.Query,
            Locals extends Record<string, any> = Record<string, any>
        > extends core.Request<P, ResBody, ReqBody, ReqQuery, Locals> {}
        interface RequestHandler<
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = core.Query,
            Locals extends Record<string, any> = Record<string, any>
        > extends core.RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {}
        interface RequestParamHandler extends core.RequestParamHandler {}
        interface Response<
            ResBody = any,
            Locals extends Record<string, any> = Record<string, any>
        > extends core.Response<ResBody, Locals> {}
        interface Router extends core.Router {}
        interface Send extends core.Send {}
    }
    export declare interface File {
        /** Name of the form field associated with this file. */
        fieldname: string;
        /** Name of the file on the uploader's computer. */
        originalname: string;
        /**
         * Value of the `Content-Transfer-Encoding` header for this file.
         * @deprecated since July 2015
         * @see RFC 7578, Section 4.7
         */
        encoding: string;
        /** Value of the `Content-Type` header for this file. */
        mimetype: string;
        /** Size of the file in bytes. */
        size: number;
        /**
         * A readable stream of this file. Only available to the `_handleFile`
         * callback for custom `StorageEngine`s.
         */
        stream: Readable;
        /** `DiskStorage` only: Directory to which this file has been uploaded. */
        destination: string;
        /** `DiskStorage` only: Name of this file within `destination`. */
        filename: string;
        /** `DiskStorage` only: Full path to the uploaded file. */
        path: string;
        /** `MemoryStorage` only: A Buffer containing the entire file. */
        buffer: Buffer;
    }
}
declare function Express(): core.Express;

export type Fn<T = unknown> = (
    req: Request & { user: user_shape & { _id: Types.ObjectId } } & {file? : File},
    res: Response,
    next: NextFunction
) => Promise<T>;
export type Error_Handler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Fn;
export type Call_Next = {
    CallNext: (msg: string, cause: number) => NextFunction;
};
export type Res1 = {
    error: string;
    __: true;
};
export type Res2 = {
    __: false;
    payload: string;
};
export type Json_Response = {
    done: boolean;
} & (Res1 | Res2);

export type Mail = {
    to: string | string[];
    html: string;
    subject?: string;
};

export type token_shape = {
    readonly email: string;
} | null;
export type user_shape = InferSchemaType<typeof users_schema>;
export type category_shape = InferSchemaType<typeof category_schema>;
export type users_role = "buyer" | "seller";

export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
