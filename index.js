/*
 * Copyright 2024 steadybit GmbH. All rights reserved.
 */

import { check } from './redirectChecker';
const core = require('@actions/core');

const publicDocsURL = core.getInput('publicDocsURL');
const gitBookConfigurationURL = core.getInput('gitBookConfigurationURL');
const logger = { debug: core.debug, info: core.info, error: core.error };

check(publicDocsURL, gitBookConfigurationURL, logger)
    .then((brokenRedirects) => {
        if (brokenRedirects.length > 0) {
            core.info('');
            core.setFailed(`Found non-working redirects:`);
            brokenRedirects.forEach((brokenRedirect) => {
                core.setFailed(`Redirect ${brokenRedirect[0]} to ${brokenRedirect[1]} isn't working`);
            });
        }
    })
    .catch((result) => core.setFailed(`Uncatched error happened: ${result}`));
