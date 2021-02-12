# CoreBot

Bot Framework v4 core bot sample.

This bot has been created using [Bot Framework](https://dev.botframework.com), it shows how to:

- Use [LUIS](https://www.luis.ai) to implement core AI capabilities
- Implement a multi-turn conversation using Dialogs
- Handle user interruptions for such things as `Help` or `Cancel`
- Prompt for and validate requests for information from the user

## Prerequisites

This sample **requires** prerequisites in order to run.

- Optional Microsoft account 

### Overview

This bot uses [LUIS](https://www.luis.ai), an AI based cognitive service, to implement language understanding.

- [Node.js](https://nodejs.org) version 10.14 or higher

    ```bash
    # determine node version
    node --version
    ```
### Create a database 

Once you created the database, update `.env` with your `host`, `user`, `database` and `password`.

```text
host="Your Host"
user="Your database Username"
password="Your database Password"
database="Your database Name"
root_password=" Your root pwd"
port="Your port"
```

### Create a LUIS Application to enable language understanding

The LUIS model for this example can be found under `cognitiveModels/FlightBooking.json` and the LUIS language model setup, training, and application configuration steps can be found [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=javascript).

Once you created the LUIS model, update `.env` with your `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName`.

```text
LuisAppId = "Your LUIS App Id"
LuisAPIKey = "Your LUIS Subscription key here"
LuisAPIHostName = "Your LUIS App region here (i.e: westus.api.cognitive.microsoft.com)"
```

## To try this sample

- Clone the repository

    ```bash
    git clone https://github.com/Ampersander/chatbot-ai
    ```

- In a terminal, navigate to `chatbot-ai`

    ```bash
    cd chatbot-ai
    ```

- Install modules

    ```bash
    npm install
    ```
- Config your `.env` with your `MicrosoftAppId`, `MicrosoftAppPassword` and `APITokenOW`.
```text
    MicrosoftAppId=MicrosoftIdOptional
    MicrosoftAppPassword=MicrosoftPasswordOptional
    APITokenOW=YourAPITokenOpenWeather
```

- Setup LUIS

    The prerequisites outlined above contain the steps necessary to provision a language understanding model on www.luis.ai.  Refer to _Create a LUIS Application to enable language understanding_ above for directions to setup and configure LUIS.

- Build the docker image

    ```bash
    docker-compose build
    ```
    ```bash
    docker-compose up d
    ```


## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the latest Bot Framework Emulator from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`
- Download ngrok
- Config the path to ngrok in the Emulator Settings
- Activate the option Bypass ngrok for local addresses and Run ngrok when the Emulator start up
-localhost override = localhost

## Deploy the bot to Azure

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.

## Further reading

- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Dialogs](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-dialog?view=azure-bot-service-4.0)
- [Gathering Input Using Prompts](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=csharp)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)
- [Azure Portal](https://portal.azure.com)
- [Language Understanding using LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Restify](https://www.npmjs.com/package/restify)
- [dotenv](https://www.npmjs.com/package/dotenv)
