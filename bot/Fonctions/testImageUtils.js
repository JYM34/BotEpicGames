// Fonctions/testImageUtils.js
const assert = require('assert');
const { getValidImageByType, isMysteryGame } = require('./imageUtils');

const dummyImages = [
    { type: 'DieselStoreFrontWide', url: 'http://image1.jpg' },
    { type: 'VaultClosed', url: 'http://image2.jpg' }
];

// ✅ Test 1 - type existant
assert.strictEqual(
    getValidImageByType("Test Game", dummyImages, "DieselStoreFrontWide"),
    'http://image1.jpg'
);

// ✅ Test 2 - fallback VaultClosed
assert.strictEqual(
    getValidImageByType("Test Game", [dummyImages[1]], "offerImageTall"),
    'http://image2.jpg'
);

// ✅ Test 3 - jeu mystère
assert.strictEqual(
    getValidImageByType("Mystery Game", [], "featuredMedia"),
    'https://ftp.nkconcept.fr/jeux-mystere.jpg'
);

// ✅ Test 4 - isMysteryGame
assert.strictEqual(isMysteryGame("Mystery Game 4"), true);
assert.strictEqual(isMysteryGame("Cat Quest"), false);

console.log("✅ Tous les tests image passés !");
