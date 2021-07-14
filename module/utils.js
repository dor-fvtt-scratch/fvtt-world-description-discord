import * as constants from './constants.js';

// Simplifies localization
export function loc(domain, section, key, locPlaceholders = {}) {
    return game.i18n.format(`${constants.moduleName}.${domain}.${section}.${key}`, locPlaceholders);
}

// Simplifies logging to the console
export function log(logString, type = 'info') {
    if (type === 'error') {
        console.error(`${constants.moduleTitle} | ${logString}`);
    } else if (type === 'warn') {
        console.warn(`${constants.moduleTitle} | ${logString}`);
    } else if (type === 'debug') {
        console.warn(`DEBUG | ${constants.moduleTitle} | ${logString}`);
    } else {
        console.log(`${constants.moduleTitle} | ${logString}`);
    }
}

// Simplifies showing a notification
export function notify(
    locMap = {},
    type = 'info',
    locPlaceholders,
    options = { permanent: false, localize: true },
) {
    const locString = loc(locMap.locDomain, locMap.locSection, locMap.locKey, locPlaceholders);
    ui.notifications.notify(`${constants.moduleTitle} | ${locString}`, type, {
        permanent: options.permanent,
        localize: options.localize,
    });
    log(locString, type);
}

// Simplified debug logging
export function debug(debugString, force = false) {
    if (game.modules.get('_dev-mode')) {
        try {
            const isDebugging = game.modules
                .get('_dev-mode')
                ?.api?.getPackageDebugValue(constants.moduleName);

            if (force || isDebugging) {
                log(debugString, 'debug');
            }
        } catch (e) {}
    }
}

// Simplifies getting settings
export function settingGet(key) {
    return game.settings.get(constants.moduleName, key);
}
