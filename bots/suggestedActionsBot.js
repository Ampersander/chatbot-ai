// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
const APITokenOW = process.env.APITokenOW;
const { ActivityHandler, MessageFactory } = require('botbuilder');
const { ActionTypes } = require('botframework-schema');
let { GoogleTraductionAPI } = require ('../ModulesAPI/GoogleTraductionAPI') ;
let { OpenWeatherMap } = require ('../ModulesAPI/OpenWeatherMap') ;
let ow = new OpenWeatherMap (APITokenOW, 'metric') ;
let gt = new GoogleTraductionAPI ('gtx', 't') ;

require ('isomorphic-fetch') ;

class SuggestedActionsBot extends ActivityHandler {
    constructor() {
        super();

        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            const text = context.activity.text;

            // Create an array with the valid color options.
           // const validOpt = ['Meteo', 'Traduction'];
            const word = ['Quelle est la météo à','Quelle est la traduction en Anglais de','Quelle est la traduction en Francais de']
            // If the `text` is in the Array, a valid color was selected and send agreement.
            if (word[0] == text.substring(0,21)) {
                var ville = text.substring(21,text.length);
                let result = await ow.getWeather (ville);
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
                await context.sendActivity( message );   

            } else if(word[1] == text.substring(0,38)){
                var trad = text.substring(38,text.length);
                let result = await gt.getTranslate2 (trad, 'fr', 'en');
                await context.sendActivity("la traduction de \""+result[0][0][1]+"\" est : " +result[0][0][0]);       

        
            }else if(word[2] == text.substring(0,39)){
                var trad = text.substring(39,text.length);
                let result = await gt.getTranslate2 (trad, 'en', 'fr');
                await context.sendActivity("la traduction de \""+result[0][0][1]+"\" est : " +result[0][0][0]);        

        
            } else{

                var message = 'Voici les différentes commandes comprises:\n\n' +
                "_ Météo : Quelle est la météo à 'Nom de ville' \n\n" + 
                "_ Traduction En : Quelle est la traduction en Anglais de 'phrase' \n\n" +
                "_ Traduction Fr : Quelle est la traduction en Francais de 'phrase' \n\n";
                await context.sendActivity(message);
            }

            // After the bot has responded send the suggested actions.
         //   await this.sendSuggestedActions(context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }


    /**
     * Send a welcome message along with suggested actions for the user to click.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;

        // Iterate over all new members added to the conversation.
        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                const welcomeMessage = `Bienvenue sur ce chatbot ${ activity.membersAdded[idx].name }. ` +
                    '\n\n Ce bot permet de traduire et de connaitre la météo \n\n' +
                   'Voici les différentes commandes comprises:\n\n' +
                "_ Météo : Quelle est la météo à 'Nom de ville' \n\n" + 
                "_ Traduction En : Quelle est la traduction en Anglais de 'phrase' \n\n" +
                "_ Traduction Fr : Quelle est la traduction en Francais de 'phrase' \n\n";
                await turnContext.sendActivity(welcomeMessage);
             //   await this.sendSuggestedActions(turnContext);
            }
        }
    }

    /**
     * Send suggested actions to the user.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    async sendSuggestedActions(turnContext) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Traduction',
                value: 'Traduction',
                image: 'https://tse4.mm.bing.net/th?id=OIP.CY76frl6MaRuUbqhfNB5uAHaHa&pid=Api&P=0&w=300&h=300',
                imageAltText: 'T'
            },
            {
                type: ActionTypes.PostBack,
                title: 'Meteo',
                value: 'Meteo',
                image: 'https://icons.iconarchive.com/icons/wineass/ios7-redesign/256/Weather-icon.png',
                imageAltText: 'M'          }

        ];

        var reply = MessageFactory.suggestedActions(cardActions, 'Que souhaitez vous faire?');
        await turnContext.sendActivity(reply);
    }
}

module.exports.SuggestedActionsBot = SuggestedActionsBot;
