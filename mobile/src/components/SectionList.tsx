import React from 'react';
import { Cartao, ItemLinha } from './ui';

export function ListaSecao<T>({ dados, mapear, vazio = 'Nenhum registro encontrado.' }: { dados: T[]; mapear: (item: T) => { titulo: string; descricao?: string }; vazio?: string }) {
  return (
    <Cartao>
      {dados.length === 0 ? <ItemLinha titulo={vazio} /> : dados.map((item, index) => {
        const linha = mapear(item);
        return <ItemLinha key={index} titulo={linha.titulo} descricao={linha.descricao} />;
      })}
    </Cartao>
  );
}
