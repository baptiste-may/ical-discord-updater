# 🗓 ICal Discord Updater

This small project manages a Discord bot that notifies when an event is added, removed, or updated in an
[iCalendar](https://wikipedia.org/wiki/ICalendar).

> [!NOTE]
> The text in Discord embeds is in French. 🇫🇷 You need to provide your own text if you want to change the language.

## 📝 Note

This code is adapted for an [ADE Calendar](https://adeconsult.be), but it can be modified to match your own calendar
system.
By default, events are checked every minute, but this can be adjusted.
You can also disable logs if needed, as the code logs frequently.

> [!NOTE]
> Fore more informations, check the [config section](#configuration).

## 📥 Installation

This is a standard installation. You just need to download the repository or clone it. After that, install the
dependencies with:

```bash
npm install
```

You'll also need a `.env` file for secret data. In this file, you need the following variables:

```dotenv
CALENDAR_URL="YOUR-URL"
CHANNEL_ID="YOUR-DISCORD-CHANNEL-ID"
DISCORD_TOKEN="YOUR-DISCORD-TOKEN"
```

And you're all set! 🎉 You can start the bot with:

```
npm start
```

or

```
npm run start
```

and let the magic happen! ✨

## ⚙️ Configuration

Some options can be configured.

<details>
<summary>🧭 Calendar system</summary>

By default, data is formatted to match [ADE Calendar](https://adeconsult.be).
You can modify the code to adapt to other calendar systems.
To do this, go to the `THIS CODE CAN BE MANAGE AS YOUR OWN` section in `index.js` and modify the following code.

</details>

<details>
<summary>⏳ Cron Schedule</summary>

The check is performed every minute by default.
To change this interval, edit the `CRON_SCHEDULE` constant (at the top of the `index.js` file) with a
valid [Cron schedule format](https://crontab.cronhub.io).

</details>

<details>
<summary>👀 Hide Logs</summary>

If you don't want extensive logging, set the `SHOW_LOGS` constant (at the top of the`index.js` file) to `false`.

</details>