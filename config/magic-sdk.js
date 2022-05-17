import { Magic } from 'magic-sdk';

const testMode = false;

// Create client-side Magic instance
function createMagic(key) {
  return (
    typeof window != 'undefined' &&
    new Magic(key, { testMode })
  );
};

// const magic = createMagic(process.env.MAGIC_PUBLISH_KEY);
const magic = createMagic('pk_live_3860ED3186BF4E12');

export default magic;
