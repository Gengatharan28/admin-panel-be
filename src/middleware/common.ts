import parser from "body-parser";
import type { Router } from "express";


export const handleBodyRequestParsing = (router: Router): void => {
    router.use(
        parser.urlencoded({
            limit: '1mb',
            extended: true,
        }),
    );
    router.use(
        parser.json({
            limit: '20mb',
        }),
    );
};