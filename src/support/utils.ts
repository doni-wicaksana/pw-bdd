// parse string
export function stringParser(text:string, regex: RegExp, callback: (match: string) => string):string {
    const match = text.match(regex);
    match?.forEach((m) => {
        let replacement = callback(m);
        if (replacement) text = text.replace(m, replacement);
    });
    return text;
}