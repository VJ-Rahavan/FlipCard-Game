export type CardTypes = {
  src: string;
  matched: boolean;
  id?: number;
  uniqueId: string;
};

export interface ICard {
  card: CardTypes;
  handleChoice: (param: CardTypes) => void;
  flipped: boolean;
  disabled: boolean;
}
