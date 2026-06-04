interface Props {
  message: string;
  mood?: 'normal' | 'happy' | 'sleepy' | 'need';
}

export function PetSpeechBubble({ message, mood = 'normal' }: Props) {
  return <div className={`pet-speech pet-speech--${mood}`}>{message}</div>;
}
