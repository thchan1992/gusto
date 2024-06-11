export type Quiz = {
  _id: string;
  isFirst: boolean;
  question: string;
  imageUrl: string;
  options: { text: string; nextQuizId: string }[];
  troubleShootId: string;
};
