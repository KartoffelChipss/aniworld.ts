export type Hoster =
    | 'voe'
    | 'filemoon'
    | 'vidmoly'
    | 'vidoza'
    | 'doodstream'
    | 'streamtape';
export const hosters: Hoster[] = [
    'voe',
    'filemoon',
    'vidmoly',
    'vidoza',
    'doodstream',
    'streamtape',
];
export function isHoster(value: string): value is Hoster {
    return hosters.includes(value as Hoster);
}

/**
 * Normalizes a string to a Hoster type if it matches known hosters.
 * @param value The string to normalize.
 * @returns The normalized Hoster or null if no match is found.
 */
export function normalizeHoster(value: string): Hoster | null {
    const lowerValue = value.trim().toLowerCase();
    for (const hoster of hosters) {
        if (lowerValue.includes(hoster)) {
            return hoster;
        }
    }
    return null;
}
