import {OBJECT, FUNCTION} from 'reshow-constant';
import typeIs from './getTypeOf';
import refError from './refError';

export default function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw refError();
  }
  const isObject = OBJECT === typeIs(call);
  return call && (isObject || typeof call === FUNCTION) ? call : self;
}
