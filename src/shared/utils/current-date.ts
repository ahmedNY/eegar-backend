export function getCurrentTime(): string {
    // TODO: use moment.js
    const currentTime = new Date();
    let hours = ("0" + currentTime.getHours()).slice(-2)
    let minutes = ("0" + currentTime.getMinutes()).slice(-2)
    let seconds = ("0" + currentTime.getSeconds()).slice(-2)
    return `${hours}:${minutes}:${seconds}`;
}

export function getCurrentDay(): number {
    return new Date().getDay();
}