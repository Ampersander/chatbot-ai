// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { LuisRecognizer } = require('botbuilder-ai');

class luisAIRecognizer {
    constructor(config) {
        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if (luisIsConfigured) {
            // Set the recognizer options depending on which endpoint version you want to use e.g v2 or v3.
            // More details can be found in https://docs.microsoft.com/en-gb/azure/cognitive-services/luis/luis-migration-api-v3
            const recognizerOptions = {
                apiVersion: 'v3'
            };

            this.recognizer = new LuisRecognizer(config, recognizerOptions);
        }
    }

    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    async executeLuisQuery(context) {
        console.log(context);
        return await this.recognizer.recognize(context);
        
    }


    getMeteoCity(result) {
        console.log(result);
        let localisation;
        console.log(result.entities.$instance.Localisation);
        if (result.entities.$instance.Localisation) {
            localisation = result.entities.$instance.Localisation[0].text;
        }
        console.log(localisation);
        return localisation ;
    }

   
}

module.exports.luisAIRecognizer = luisAIRecognizer;
