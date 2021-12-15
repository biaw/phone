[![Test build](https://img.shields.io/github/workflow/status/promise/phone/Build%20and%20publish)](https://github.com/promise/phone/actions/workflows/build-and-publish.yml)
[![Linting](https://img.shields.io/github/workflow/status/promise/phone/Linting?label=quality)](https://github.com/promise/phone/actions/workflows/linting.yml)
[![Analysis and Scans](https://img.shields.io/github/workflow/status/promise/phone/Analysis%20and%20Scans?label=scan)](https://github.com/promise/phone/actions/workflows/analysis-and-scans.yml)
[![DeepScan grade](https://deepscan.io/api/teams/16173/projects/19486/branches/507856/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16173&pid=19486&bid=507856)
[![discord.js version](https://img.shields.io/github/package-json/dependency-version/promise/phone/discord.js)](https://www.npmjs.com/package/discord.js)
[![GitHub Issues](https://img.shields.io/github/issues-raw/promise/phone.svg)](https://github.com/promise/phone/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr-raw/promise/phone.svg)](https://github.com/promise/phone/pulls)

# phone

A Discord application to call your phone (yes, your actual phone) through Twilio in case of emergencies.

![Example](https://i.imgur.com/w6RL1Gi.gif)

## Usage examples

- If you're managing some form of service, like a webserver or Discord bot then your staff can call your cellphone if it's down.
- If a server you're admin in is getting raided and you're not available, they can call your cellphone to let you know.

Generally, it's a way for other Discord members to contact you through your phone. The main purpose is to be even more available, like when you don't have Wi-Fi/celluar data availale.

## Setup

### Requirements

You will need:
- a Discord bot set up (https://discord.dev)
- a private Discord server
  - this will be where you can whitelist other people, and also call others with your phone number. The server is mostly to register admin-only commands so it doesn't appear in public slash command lists on other servers. The commands are still role-locked.
- a Twilio account set up with a bought phone number

### Setting up using Docker

With Docker, you don't even need to download anything. Fill in the environment variables and you should be able to run the commands below. See the [`example.env`](https://github.com/promise/phone/blob/master/example.env)-file for more information on what to fill these values with.

Having a log volume is optional, it's mostly for development and debugging. A database volume is required though, as we store information like whitelisted users etc.

#### Linux

```cmd
docker run --name phone \
  -e "DISCORD_TOKEN=" \
  -e "DISCORD_OWNER_ID=" \
  -e "DISCORD_GUILD_ID=" \
  -e "TWILIO_ACCOUNT_SID=" \
  -e "TWILIO_AUTH_TOKEN=" \
  -e "TWILIO_PHONE_NUMBER=" \
  -e "OWNER_PHONE_NUMBER=" \
  -v /phone/database:/app/database \
  -v /phone/logs:/app/logs \
  promisesolutions/phone:latest
```

#### Windows

```cmd
docker run --name phone ^
  -e "DISCORD_TOKEN=" ^
  -e "DISCORD_OWNER_ID=" ^
  -e "DISCORD_GUILD_ID=" ^
  -e "TWILIO_ACCOUNT_SID=" ^
  -e "TWILIO_AUTH_TOKEN=" ^
  -e "TWILIO_PHONE_NUMBER=" ^
  -e "OWNER_PHONE_NUMBER=" ^
  -v "C:\phone\database":/app/database ^
  -v "C:\phone\logs":/app/logs ^
  promisesolutions/phone:latest
```

## Pricing

As you can see in the GIF above, it does cost money because of Twilio, and it really depends on your location, the Twilio phone number's location etc. - but a free trial at Twilio will probably get you a long way already.