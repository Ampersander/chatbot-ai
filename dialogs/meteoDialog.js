// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
const APITokenOW = process.env.APITokenOW;
const bddHost = process.env.host;
const bddUser = process.env.user;
const bddPassword = process.env.password;
const bddDatabase = process.env.database;
const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
let { OpenWeatherMap } = require ('../ModulesAPI/OpenWeatherMap') ;
let { bddChatBot } = require ('../mysql/db_connection') ;
let bddchat = new bddChatBot(bddHost,bddUser,bddPassword,bddDatabase);
let ow = new OpenWeatherMap (APITokenOW, 'metric') ;
require ('isomorphic-fetch') ;
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class MeteoDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'meteoDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.cityStep.bind(this),
                this.callAPIStep.bind(this),
                this.finalStep.bind(this)
            ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If the city has not been provided, prompt for one.
     */
    async cityStep(stepContext) {
        const meteoDetails = stepContext.options;
        console.log('""""""""""""""""""""""""');
        console.log(meteoDetails);
        if (!meteoDetails.localisation) {
            const messageText = 'Vous souhaitez la météo de quelle ville?';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(meteoDetails.localisation);
    }
 /**
     * Confirm the information the user has provided.
     */
    async callAPIStep(stepContext) {
        const meteoDetails = stepContext.options;
        // Capture the results of the previous step
        meteoDetails.localisation = stepContext.result;
        var ville =  meteoDetails.localisation;
        let result = await ow.getWeather (ville);
        let goodCity = await this.showWarningForUnsupportedCities(stepContext,ville, result);
        if(goodCity == true){
            var previsions = {
                temperature : Math.round(result.main.temp),
                humidity : result.main.humidity,
                wind: Math.round(result.wind.speed * 3.6),
                city : result.name,
            };
            var message = 'Voici la météo pour ' + ville + ' :\n\n' +
            '_ Température : ' + previsions.temperature + '°C\n\n' + 
            '_ Humidité : ' + previsions.humidity + '%\n\n' +
            '_ Vent : ' + previsions.wind + 'km/h';
            bddchat.insertLastWeather(ville,message);
            const msg = MessageFactory.text(message, message, InputHints.ExpectingInput);
            // Offer a YES/NO prompt.
            return await stepContext.context.sendActivity(msg);
    }else{
        return await stepContext.beginDialog('meteoDialog');
    }
    }
    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            const meteoDetails = stepContext.options;
            return await stepContext.endDialog(meteoDetails);
        }
        return await stepContext.endDialog();
    }


    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }

    /**
     * If the city is not supported
     */
    async showWarningForUnsupportedCities(stepContext, city,result) {
        console.log('//////');
        console.log(city);
        console.log(result);
        const unsupportedCities = [];
       if(result.message === 'city not found'){          
            unsupportedCities.push(city); 
            if (unsupportedCities.length) {
                const messageText = `Désolé mais les villes suivantes ne sont pas supportés: ${ unsupportedCities.join(', ') }`;
                await stepContext.context.sendActivity(messageText, messageText, InputHints.IgnoringInput);
            }return false;  
        }else{
            return true;
        }

    }  
}




module.exports.MeteoDialog = MeteoDialog;

   
