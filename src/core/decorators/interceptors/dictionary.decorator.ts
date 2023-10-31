import { SetMetadata } from '@nestjs/common';

export const DICITIONARY_KEY = "dictionary";
export const Dictionary = (dict: string) => SetMetadata(DICITIONARY_KEY, dict);