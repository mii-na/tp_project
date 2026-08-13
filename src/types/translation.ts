import type { WordInfo } from "./WordInfo";

export type Translation = {
    original: string;
    english: string;
    japanese: string;
    words: WordInfo[];
};