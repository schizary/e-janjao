import { v4 as uuidv4 } from 'uuid';
import { GeradorId } from './tipos/GeradorId';

export class GeradorIdUuid implements GeradorId {
  gerar(): string {
    return uuidv4();
  }
}
