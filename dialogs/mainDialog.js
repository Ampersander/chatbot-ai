// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { MessageFactory, InputHints } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const moment = require('moment-timezone');
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer,meteoDialog) {
        super('MainDialog');

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;
        if (!meteoDialog) throw new Error('[MainDialog]: Missing parameter \'meteoDialog\' is required');

        // Define the main dialog and its related components.
        // This is a sample "book a flight" dialog.
        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(meteoDialog)
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.introStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     */
    async introStep(stepContext) {
        if (!this.luisRecognizer.isConfigured) {
            const messageText = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(messageText, null, InputHints.IgnoringInput);
            return await stepContext.next();
        }

        const weekLaterDate = moment().add(7, 'days').format('MMMM D, YYYY');
        const messageText = stepContext.options.restartMsg ? stepContext.options.restartMsg : 
        `Comment puis-je vous aider aujourd'hui le ${ weekLaterDate }? \n
         Vous pouvez me demander la météo ou de traduire \n
         des mots si vous le souhaitez =)`;
        const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt('TextPrompt', { prompt: promptMessage });
    }

    /**
     * Second step in the waterfall.  This will use LUIS to attempt to extract the city
     * Then, it hands off to the meteoDialog child dialog to collect any remaining details.
     */
    async actStep(stepContext) {
        const details = {};

        if (!this.luisRecognizer.isConfigured) {
            // LUIS is not configured, we just run the meteoDialog path.
            return await stepContext.beginDialog('meteoDialog', details);
        }

        // Call LUIS and gather any potential details. (Note the TurnContext has the response to the prompt)
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        switch (LuisRecognizer.topIntent(luisResult)) {
        case 'GetWeather': {
            // Extract the values for the composite entities from the LUIS result.
            const city = this.luisRecognizer.getMeteoCity(luisResult);
        
            details.localisation = city;
            console.log('LUIS extracted these details:', JSON.stringify(details));
         //   await stepContext.context.sendActivity(getWeatherMessageText, getWeatherMessageText, InputHints.IgnoringInput);
            // Run the meteoDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
            
            return await stepContext.beginDialog('meteoDialog',details);
        }

        default: {
            // Catch all for unhandled intents
            const didntUnderstandMessageText = "Désolé, je n'ai pas compris. S'il vous plait essayer d'une autre manière" ;
            //(L'intentien était ${ LuisRecognizer.topIntent(luisResult) })+?
            await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
        }
        }

        return await stepContext.next();
    }

  

    /**
     * This is the final step in the main waterfall dialog.
     *  We can put a confirmation here.
     */
    async finalStep(stepContext) {
        // If the child dialog ("getWeather") was cancelled or the user failed to confirm, the Result here will be null.

        // Restart the main dialog with a different message the second time around
        return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'Que puis-je faire pour vous?' });
    }
}

module.exports.MainDialog = MainDialog;
