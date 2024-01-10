/*
 * Copyright 2024 steadybit GmbH. All rights reserved.
 */

import { check } from './redirectChecker';
import core from '@actions/core';

const publicDocsURL = core.getInput('publicDocsURL');
const gitBookConfigurationURL = core.getInput('gitBookConfigurationURL');
const logger = { debug: core.debug, info: core.info, error: core.error };

check(publicDocsURL, gitBookConfigurationURL, logger)
    .then((brokenUrls) => {
        if (brokenUrls) {
            core.setFailed(`Found non-working redirects, check the logs`);
        }
    })
    .catch((result) => core.setFailed(`Uncatched error happened: ${result}`));
