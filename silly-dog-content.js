'use strict';
// Provisional playtest stats for the approved Silly-type dog.
CharacterData.sillydog = {
 name: 'Waggles',
 types: ['Silly'],
 ability: null,
 stats: {hp:65, mp:24, attack:55, specialAttack:45, defense:45, specialDefense:45, speed:55}
};

// Add the new companion once, including when continuing a pre-existing save.
const loadBeforeSillyDog = Menus.load;
Menus.load = (data, selected) => {
 loadBeforeSillyDog(data, selected);
 if (!Menus.state.monsters.some(monster => monster.kind === 'sillydog')) {
  Menus.addMonster('sillydog');
 }
};

