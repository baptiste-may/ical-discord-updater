/**
 * Check if two dates have the same hour
 * @param d1 {Date} Date 1
 * @param d2 {Date} Date 2
 * @return {boolean} Those two dates have the same hour
 */
function differentHour(d1, d2) {
    return d1.getSeconds() !== d2.getSeconds() || d1.getMinutes() !== d2.getMinutes() || d1.getHours() !== d2.getHours();
}

/**
 * Check if two dates have the same day
 * @param d1 {Date} Date 1
 * @param d2 {Date} Date 2
 * @return {boolean} Those two dates have the same day
 */
function differentDay(d1, d2) {
    return d1.getDay() !== d2.getDay() || d1.getMonth() !== d2.getMonth() || d1.getFullYear() !== d2.getFullYear();
}

/**
 * Return an object of differents elements between two events
 * @param e1 {{summary: string, start: string, description: string, end: string, location: string, day: string}} Event 1
 * @param e2 {{summary: string, start: string, description: string, end: string, location: string, day: string}} Event 2
 * @return {{summary: boolean, start: boolean, description: boolean, end: boolean, location: boolean, day: boolean}}
 */
function differentsEvents(e1, e2) {
    return {
        summary: e1.summary !== e2.summary,
        description: e1.description !== e2.description,
        start: differentHour(new Date(e1.start), new Date(e2.start)),
        end: differentHour(new Date(e1.end), new Date(e2.end)),
        location: e1.location !== e2.location,
        day: differentDay(new Date(e1.start), new Date(e2.start)),
    };
}

/**
 * Check if there is at least one element who is different
 * @param diffs {{summary: boolean, start: boolean, description: boolean, end: boolean, location: boolean, day: boolean}} Differents between elements
 * @return {boolean} There is at least one element who is different
 */
function hasDiff(diffs) {
    for (const bool of Object.values(diffs)) {
        if (bool) return true;
    }
    return false;
}

/**
 * Return a discord embed field from an event or from two different events
 * @param event {{summary: string, start: string, description: string, end: string, location: string, day: string}} The main event
 * @param otherEvent {{summary: string, start: string, description: string, end: string, location: string, day: string}} The other event if there are differents
 * @param diffs {{summary: boolean, start: boolean, description: boolean, end: boolean, location: boolean, day: boolean}} Differents between elements if there are
 * @return {{inline: boolean, name: string, value: string}} The field
 */
function eventToField(event, otherEvent, diffs) {

    const startTimestamp = Math.floor(new Date(event.start).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(event.end).getTime() / 1000);

    const otherStartTimestamp = otherEvent ? Math.floor(new Date(otherEvent.start).getTime() / 1000) : null;
    const otherEndTimestamp = otherEvent ? Math.floor(new Date(otherEvent.end).getTime() / 1000) : null;

    let name = ((diffs && diffs.summary) ? "~~" : "") + event.summary + ((diffs && diffs.summary) ? ("~~ **" + otherEvent.summary + "**") : "") + "\n" + ` (${(diffs && diffs.day) ? "~~" : ""}<t:${startTimestamp}:D> <t:${startTimestamp}:R>${(diffs && diffs.day) ? ("~~ **<t:" + otherStartTimestamp + ":D> <t:" + otherStartTimestamp + ":R>**") : ""})`;
    let value = "";

    if (event.location)
        value += `- 🚩 ${(diffs && diffs.location) ? "~~" : ""}${event.location}${(diffs && diffs.location) ? ("~~ **" + otherEvent.location + "**") : ""}\n`

    value += `- ⏲️ ${(diffs && diffs.start) ? "~~" : ""}<t:${startTimestamp}:t>${(diffs && diffs.start) ? ("~~ **<t:" + otherStartTimestamp + ":t>**") : ""} - ${(diffs && diffs.end) ? "~~" : ""}<t:${endTimestamp}:t>${(diffs && diffs.end) ? ("~~ **<t:" + otherEndTimestamp + ":t>**") : ""}\n`;

    value += ((diffs && diffs.description) ? otherEvent.description : (event.description || "")) || "";

    if (value === "")
        value = "*Aucune information complémentaire*"

    return {
        name,
        value,
        inline: true
    };
}

module.exports = {
    differentsEvents,
    eventToField,
    hasDiff,
}