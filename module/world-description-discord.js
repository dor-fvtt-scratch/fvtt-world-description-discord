import { settingGet, notify, debug } from './utils.js';

export class WorldDescriptionToDiscord {
    static async postToDiscord(data) {
        var params = {
            username: data.title,
            avatar_url: encodeURI(this._avatarImageUrl(data.background)),
            content: `> ${data.description.replace(/<\/?[^>]+(>|$)/g, '')}`,
            embeds: [
                {
                    image: {
                        url: encodeURI(this._backgroundImageUrl(data.background)),
                    },
                    description: 'Next session:',
                    timestamp: data.nextSession,
                },
            ],
        };

        const url = settingGet('webhookUrl');
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/JSON',
            },
            body: JSON.stringify(params),
        })
            .then(function (response) {
                if (response.status === 204) {
                    notify({
                        domain: 'userAlerts',
                        section: 'postToDiscord',
                        key: 'postSucceeded',
                    }); // HTTP 200 = successful push
                } else {
                    notify(
                        { domain: 'userAlerts', section: 'postToDiscord', key: 'postFailed' },
                        'error',
                        undefined,
                        { permanent: true },
                    ); // Any other HTTP code - push failed
                    debug(`POST did not succeed: HTTP ${response.status}`);
                }
            })
            .catch(function (err) {
                notify(
                    { domain: 'userAlerts', section: 'postToDiscord', key: 'postFailed' },
                    'error',
                    undefined,
                    { permanent: true },
                ); // Any other HTTP code - push failed
                debug(`An error occured when posting to Discord: ${err}`);
            });
    }

    static _avatarImageUrl(backgroundImgPath) {
        const avatarImage = settingGet('avatarImage');
        // Check if there is an avatar image set
        if (avatarImage) {
            // If an avatar image is set, check if it is an absolute path or relative path
            if (avatarImage.startsWith('http')) {
                // If absolute path, return it
                return avatarImage;
                // Otherwise, make it an absolute path then return it
            } else {
                return settingGet('gameUrl') + settingGet('avatarImage');
            }
            // If no avatar image is set, use the background image instead.
        } else {
            return this._backgroundImageUrl(backgroundImgPath);
        }
    }

    static _backgroundImageUrl(backgroundImgPath) {
        if (backgroundImgPath.startsWith('http')) {
            return backgroundImgPath;
        } else {
            return settingGet('gameUrl') + backgroundImgPath;
        }
    }
}
