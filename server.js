const
  Discord = require("discord.js"),
  Twilio = require("twilio"),
  fs = require("fs"),
  config = require("./config.json"),
  dClient = new Discord.Client({

  }),
  tClient = Twilio(config.twilio.account_sid, config.twilio.auth_token);
let
  db = fs.existsSync("./db.json") ? require("./db.json") : []; // yes, it's a json db. who cares.

dClient.on("ready", () => {
  console.log(`Discord client ready as ${dClient.user.tag}!`);

  if (!db.includes(config.owner)) {
    db.push(config.owner);
    fs.writeFile("./db.json", JSON.stringify(db), "utf8", () => {});
  }

  dClient.api.applications(dClient.user.id).commands.post({ data: {
    name: "call",
    description: "Call my phone, preferably during emergencies when I'm not already online.",
    options: [
      {
        type: 3,
        name: "message",
        description: "The message you want to include in the call.",
        required: true
      }
    ]
  }});

  dClient.api.applications(dClient.user.id).guilds(config.main_guild).commands.post({ data: {
    name: "invitelink",
    description: "Get the invite link for the bot so you can add the command to other servers you manage."
  }});

  dClient.api.applications(dClient.user.id).guilds(config.main_guild).commands.post({ data: {
    name: "whitelist",
    description: "Whitelist an ID, this can be an user ID or a role ID.",
    options: [
      {
        type: 3,
        name: "id",
        description: "User ID or role ID to toggle whitelist on.",
        required: true
      }
    ]
  }});

  dClient.api.applications(dClient.user.id).guilds(config.main_guild).commands.post({ data: {
    name: "callother",
    description: "Call someone else.",
    options: [
      {
        type: 3,
        name: "number",
        description: "The other person's number.",
        required: true
      },
      {
        type: 3,
        name: "message",
        description: "The raw message you want to include in the call.",
        required: true
      }
    ]
  }});
});

dClient.ws.on("INTERACTION_CREATE", async interaction => {
  if (interaction.data.name == "call") {
    if (!db.find(id => interaction.member.user.id == id || interaction.member.roles.includes(id) || interaction.guild_id == id)) // check whitelist
      return dClient.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 4,
        data: {
          content: config.messages.denied,
          flags: 64 // private message
        }
      }});

    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.say(`One new message from ${interaction.member.nick || interaction.member.user.username}: ${interaction.data.options[0].value}`);
    
    tClient.calls.create({
      twiml: twiml.toString(),
      to: config.phone_number,
      from: config.twilio.phone_number
    }).then(async call => {
      await dClient.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 4,
        data: {
          content: config.messages.calling
        }
      }});

      let currentStatus = "queued";
      while (!["completed", "busy", "failed"].includes(currentStatus)) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // sleep between calls
        const { status, price, priceUnit, duration } = await tClient.calls(call.sid).fetch();
        if (status !== currentStatus) {
          if (status == "in-progress") await dClient.api.webhooks(dClient.user.id, interaction.token).messages["@original"].patch({ data: { content: config.messages.in_progress }});
          else if (status == "completed") await dClient.api.webhooks(dClient.user.id, interaction.token).messages["@original"].patch({ data: { content: config.messages.finished.replace(/\{1\}/g, price ? `${price} ${priceUnit}` : "N/A").replace(/\{2\}/g, duration) }});
          else if (status == "busy") await dClient.api.webhooks(dClient.user.id, interaction.token).messages["@original"].patch({ data: { content: config.messages.line_busy }});
          else if (status == "failed") await dClient.api.webhooks(dClient.user.id, interaction.token).messages["@original"].patch({ data: { content: config.messages.failed }});
          currentStatus = status;
        }
      }

      if (["busy", "failed"].includes(currentStatus)) tClient.messages.create({
        body: `One new message from ${interaction.member.nick || interaction.member.user.username}:\n\n${interaction.data.options[0].value}`,
        to: config.phone_number,
        from: config.twilio.phone_number
      });
    });
  } else if (interaction.data.name == "invitelink") {
    dClient.api.interactions(interaction.id, interaction.token).callback.post({ data: {
      type: 4,
      data: {
        content: `🔗 <https://discord.com/api/oauth2/authorize?client_id=${dClient.user.id}&scope=applications.commands>\nKeep in mind the call-command will only work for those who are whitelisted.`,
        flags: 64 // private message
      }
    }});
  } else if (interaction.data.name == "whitelist") {
    const id = interaction.data.options[0].value;
    if (db.includes(id)) {
      db = db.filter(i => i !== id);
      dClient.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 4,
        data: {
          content: `✅ Removed ID \`${id}\` from the whitelist.`,
          flags: 64 // private message
        }
      }});
    } else {
      db.push(id);
      dClient.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 4,
        data: {
          content: `✅ Added ID \`${id}\` to the whitelist.`,
          flags: 64 // private message
        }
      }});
    }
    fs.writeFile("./db.json", JSON.stringify(db), "utf8", () => {});
  } else if (interaction.data.name == "callother") {
    const phonenumber = interaction.data.options.find(o => o.name == "number").value;
    const message = interaction.data.options.find(o => o.name == "message").value;

    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.say(message);

    tClient.calls.create({
      twiml: twiml.toString(),
      to: phonenumber,
      from: config.twilio.phone_number
    }).then(async call => {
      await dClient.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 4,
        data: {
          content: config.messages.calling
        }
      }});

      let currentStatus = "queued";
      while (!["completed", "busy", "failed"].includes(currentStatus)) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // sleep between calls
        const { status, price, priceUnit, duration } = await tClient.calls(call.sid).fetch();
        if (status !== currentStatus) {
          if (status == "in-progress") await dClient.api.webhooks(dClient.user.id, interaction.token).messages["@original"].patch({ data: { content: config.messages.in_progress }});
          else if (status == "completed") await dClient.api.webhooks(dClient.user.id, interaction.token).messages["@original"].patch({ data: { content: config.messages.finished.replace(/\{1\}/g, price ? `${price} ${priceUnit}` : "N/A").replace(/\{2\}/g, duration) }});
          else if (status == "busy") await dClient.api.webhooks(dClient.user.id, interaction.token).messages["@original"].patch({ data: { content: config.messages.line_busy }});
          else if (status == "failed") await dClient.api.webhooks(dClient.user.id, interaction.token).messages["@original"].patch({ data: { content: config.messages.failed }});
          currentStatus = status;
        }
      }
    })
  }
});

dClient.login(config.token);
