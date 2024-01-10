/*
 * Copyright 2024 steadybit GmbH. All rights reserved.
 */

import axios from 'axios';

export async function check(publicDocsURL, gitBookConfigurationURL, logger) {
    const response = await axios.get(gitBookConfigurationURL);
    const content = response.data.split('\n');
    let redirectsStartingLine = 0;
    for (; redirectsStartingLine < content.length; redirectsStartingLine++) {
        if (content[redirectsStartingLine].indexOf('redirects:') !== -1) {
            break;
        }
    }

    logger.debug(`Found ${content.length - redirectsStartingLine - 1} redirect rules. Starting to check...`);
    logger.debug('---------------------------');

    let brokenRedirects = false;
    redirectsStartingLine += 138;
    for (let i = redirectsStartingLine + 1; i < content.length; i++) {
        const redirectRule = content[i].replace(/\s/g, '').split(':');
        if (redirectRule.length > 0 && redirectRule[0].length > 0) {
            const url = `${publicDocsURL}/${redirectRule[0]}`;
            try {
                await axios.get(url);
                logger.debug(`Rule ${redirectRule[0]} works`);
            } catch (error) {
                logger.error(`Rule ${redirectRule[0]} is broken: URL ${url} redirecting to ${redirectRule[1]} gave response ${error}`);
                brokenRedirects = true;
            }
        }
    }
    return brokenRedirects;
}
