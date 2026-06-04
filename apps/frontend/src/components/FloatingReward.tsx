interface Props {
  text: string;
  kind?: 'coins' | 'xp' | 'care' | 'level';
  visible?: boolean;
}

export function FloatingReward({ text, kind = 'care', visible = true }: Props) {
  if (!visible) return null;
  return <div className={`floating-reward floating-reward--${kind}`} aria-live="polite">{text}</div>;
}
