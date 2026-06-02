import React from 'react';
import { View } from 'react-native';
import { Cartao, ItemLinha } from './ui';

export function ListaSecao<T>({
  dados,
  mapear,
  vazio = 'Nenhum registro encontrado.',
  chave,
  acoes,
}: {
  dados: T[];
  mapear: (item: T) => { titulo: string; descricao?: string };
  vazio?: string;
  chave?: (item: T) => string;
  acoes?: (item: T) => React.ReactNode;
}) {
  return (
    <Cartao>
      {dados.length === 0 ? (
        <ItemLinha titulo={vazio} />
      ) : (
        dados.map((item, index) => {
          const linha = mapear(item);
          const key = chave ? chave(item) : String(index);
          return (
            <View key={key}>
              <ItemLinha titulo={linha.titulo} descricao={linha.descricao} />
              {acoes ? <View style={{ marginBottom: 10 }}>{acoes(item)}</View> : null}
            </View>
          );
        })
      )}
    </Cartao>
  );
}
