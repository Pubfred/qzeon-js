/** @module networks */

module.exports = {
  /** @type {Network} */
  zeon: {
    messagePrefix: '\x18ZEON Signed Message:\n',
    bip32: {
      public: 0x023d3537, // base58 will have a prefix 'qpub'
      private: 0x0231512a // base58Priv will have a prefix 'qpriv'
    },
    name: 'mainnet',
    nethash: '00000c9c83e5970601b5af203855c305a7e426deb667e6a8b3d1e1f66b52d220',
    token: 'Zeon',
    symbol: 'ZEON',
    pubKeyHash: 0x50, // Addresses will begin with 'Z'
    explorer: 'https://explorer.zeonhexalgo.fun',
    wif: 0x9e, // Network prefix for wif generation
    activePeer: {
      ip: '45.77.137.85',
      port: 32222
    },
    peers: [

    ],
  },
  /** @type {Network} */
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    wif: 0x80
  }
}
