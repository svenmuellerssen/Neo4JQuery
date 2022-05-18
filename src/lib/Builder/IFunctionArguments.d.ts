export interface IFunctionArguments {
    /**
     * Original string that will be modified.
     */
    readonly original: string | number | boolean;
    /**
     * substring: Position to start slicing the string.
     */
    readonly start?: number;
    /**
     * right|substring: number of characters to
     * be extract from original string.
     */
    readonly length?: number;
    /**
     * replace: String seeked in original string.
     */
    readonly haystack?: string;
    /**
     * replace: String that replaces haystack string.
     */
    readonly replace?: string;
    /**
     * split: Delimiter string where the
     * original string has to be split.
     */
    readonly delimiter?: string;
}
