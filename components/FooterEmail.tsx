'use client';

export default function FooterEmail({ style }: { style?: React.CSSProperties }) {
  const email = ['info', 'krcka-kuca.hr'].join('@');
  return (
    <a href={`mailto:${email}`} style={style}>
      {email}
    </a>
  );
}
