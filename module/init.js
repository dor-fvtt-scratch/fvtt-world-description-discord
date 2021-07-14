import * as constants from './constants.js';
import { WorldDescriptionToDiscord } from './world-description-discord.js';

Hooks.on('init', function () {
    game.settings.register(constants.moduleName, 'webhookUrl', {
        name: 'Discord Webhook URL',
        hint: 'This should be the webhook URL for the server/channel you want to send chat messages to.',
        scope: 'world',
        config: true,
        default: '',
        type: String,
    });

    game.settings.register(constants.moduleName, 'gameUrl', {
        name: 'Game URL',
        hint: 'This should be the URL for your game server.',
        scope: 'world',
        config: true,
        default: 'https://',
        type: String,
    });

    game.settings.register(constants.moduleName, 'avatarImage', {
        name: 'Optional: Discord Avatar Image',
        hint: 'Choose an image that will be used as the Discord avatar image for Word Description updates.',
        scope: 'world',
        config: true,
        default: '',
        type: String,
        filePicker: true,
    });
});

// Register with devMode module for debugging purposes
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(`${constants.moduleName}`);
});

// Hooks.on('renderWorldConfig', async (app, html, data) => {
//     console.log('Rendering world config.');
// });

Hooks.on('closeWorldConfig', async (app) => {
    console.log('Closing world config.');
    WorldDescriptionToDiscord.postToDiscord(app.object.data);
});
