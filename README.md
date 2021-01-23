# Discord Emergency Phone

A Discord application to call your cellphone through Twilio in case of emergencies. Is your staff in dangerously need of assistance? Is your server getting raided? Did something blow up on your VPS? This will make it easy for your staff members (or friends, colleagues, etc.) to call your cellphone through Discord.

## Screenshot

![The /call command](https://i.imgur.com/CfjgfCt.gif)

## Setup

You will need:
- this source code forked or downloaded to a folder
- a Discord bot added to a private server (for you only)
- a Twilio account set up with a bought phone number

Once you have all of these available, rename the `config.example.json` to `config.json`, fill it in and customize the messages to however you'd like them. Also do `npm i` in the directory to download all the modules needed for this to work.

When you have the bot running (do `node .` to start it), you can then go to your private server and write `/invitelink` to get the invite link. You can add the application to other servers you'd like, and it does not show up in the members list because it is only using the application commands to interact. Nice, right?

You also need to whitelist the users you want to be able to call you. Do `/whitelist id:12345678` with the ID of a user. You can also whitelist entire roles with the same command to whitelist all the users that has this role. An example would be a general Staff role.

## Pricing

As you can see in the GIF above, it does cost money because of Twilio, and it really depends on your location, the Twilio phone number's location etc. - but a free trial at Twilio will probably get you a long way already.