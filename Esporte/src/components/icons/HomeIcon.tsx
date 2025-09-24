import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = { color?: string; size?: number };

export function HomeIcon({ color = '#888', size = 28 }: Props) {
  // O código do seu SVG 'home.svg' vai aqui
  // Exemplo de um ícone de "casa"
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" // Contorno
      />
    </Svg>
  );
}

export function HomeIconFilled({ color = '#10CF65', size = 28 }: Props) {
  // Crie uma versão preenchida do seu SVG no Figma e cole o path aqui
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
       <Path
        fill={color}
        d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" // Preenchido
      />
    </Svg>
  );
}