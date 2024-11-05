// ---- { Config } ----
const CRON_SCHEDULE = "0 * * * * *";  // Set cron schedule for calendar analyze
const SHOW_LOGS = true;  // Set to false to hide logs

// ---- { Libs } ----
require("dotenv").config()
const ical = require("node-ical");
const cron = require("node-cron");
const {Client, Events, GatewayIntentBits, EmbedBuilder} = require("discord.js");
const {differentsEvents, eventToField, hasDiff} = require("./utils.js");

// ---- { Secrets } ----
const url = process.env.CALENDAR_URL;
const channelId = process.env.CHANNEL_ID;
const token = process.env.DISCORD_TOKEN;

if (url === undefined) throw new Error("❌ Missing calendar URL");
if (channelId === undefined) throw new Error("❌ Missing discord channel ID");
if (token === undefined) throw new Error("❌ Missing discord token");

// ---- { Main program } ----
const client = new Client({intents: [GatewayIntentBits.Guilds]});  // Creating discord client

let beforeData;  // Data that will be used to compare
/**
 * Compare current data with new data
 * @param data {Record<string, object>} The new data
 * @return {[[string, object][],[string, object][],[string,[string, object][],[string, object][],{summary: boolean, start: boolean, description: boolean, end: boolean, location: boolean, day: boolean}][]]}
 */
const compare = (data) => {
    const beforeKeys = Object.keys(beforeData);
    const dataKeys = Object.keys(data);
    const added = Object.entries(data).filter(([key]) => !beforeKeys.includes(key));
    const removed = Object.entries(beforeData).filter(([key]) => !dataKeys.includes(key));
    const notChangedKeys = beforeKeys.filter(key => dataKeys.includes(key));
    const notChanged = notChangedKeys.map(key => [key, beforeData[key], data[key], differentsEvents(beforeData[key], data[key])]);
    const edited = notChanged.filter(([, , , diffs]) => hasDiff(diffs));
    return [added, removed, edited];
};

client.once(Events.ClientReady, async readyClient => {  // Execute everything when the client is ready

    let channel;
    try {
        channel = await client.channels.fetch(channelId);  // Check if channel exists
    } catch (e) {
        throw new Error(`❌ Channel ${channelId} does not exists`);
    }

    cron.schedule(CRON_SCHEDULE, () => {  // Start cron
        if (SHOW_LOGS) console.log("📡 Fetching calendar...");
        ical.fromURL(url, {}, (err, data) => {
            if (err) throw err;

            // ---- { THIS CODE CAN BE MANAGE AS YOUR OWN } ----
            delete data.vcalendar;
            for (const key of Object.keys(data)) {
                data[key].description = data[key].description.slice(3, -42);
            }
            // --------------------------------------------------

            if (beforeData === undefined) {  // If it's the first time
                beforeData = data;
                if (SHOW_LOGS) console.log("📂 First run, no data to compare.");
                return;
            }

            const [added, removed, edited] = compare(data);  // Compare current data with new one

            if (added.length === 0 && removed.length === 0 && edited.length === 0) {  // Check if nothing changed
                if (SHOW_LOGS) console.log("💤 No changes.");
                return;
            }

            const embeds = [];

            if (SHOW_LOGS) added.forEach(([id, data]) => console.log(`[➕] ${id}`, data));  // Print events that been added

            if (added.length !== 0) {  // If there is at least one event, create an embed and add the events
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle("✅ Ajouts");
                added.forEach(([, data]) => {
                    embed.addFields(eventToField(data));
                });
                embeds.push(embed);
            }

            if (SHOW_LOGS) removed.forEach(([id, data]) => console.log(`[➖] ${id}`, data));  // Print events that been removed

            if (removed.length !== 0) {  // If there is at least one event, create an embed and add the events
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle("❌ Suppressions");
                removed.forEach(([, data]) => {
                    embed.addFields(eventToField(data));
                });
                embeds.push(embed);
            }

            if (SHOW_LOGS) edited.forEach(([id, data, , diffs]) => console.log(`[〰️] ${id}`, data, diffs));  // Print events that been edited

            if (edited.length !== 0) {  // If there is at least one event, create an embed and add the events
                const embed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setTitle("🌀 Modifications");
                edited.forEach(([, before, data, diffs]) => {
                    embed.addFields(eventToField(before, data, diffs));
                });
                embeds.push(embed);
            }

            channel.send({  // Send the embeds to the channel
                content: "> # L'agenda a été modifié !",
                embeds
            });

            // Change current data with the new one
            beforeData = data;
        });
    });

    // Everything loaded correctly!
    console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);  // Log to the client
