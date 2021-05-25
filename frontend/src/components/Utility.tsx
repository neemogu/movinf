export function convertDate(date: Date) {
    return "" + date.getFullYear() + "-" +
        (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" +
        (date.getDay() + 1 >= 10 ? date.getDay() + 1 : "0" + (date.getMonth() + 1));
}

export function strOrGap(str: string | null): string {
    return str !== null ? str : "-";
}

export const backLink = 'http://35.239.66.122:8080';
