'use strict';
for(const name of ['Panel','Portrait','Card','Ribbon','Slot','Deck'])menuRoot.style.setProperty('--journal-'+name.toLowerCase(),'url("'+ASSETS['journal'+name]+'")');
menuRoot.style.setProperty('--equipment-gold-frame','url("'+ASSETS.equipmentGoldFrame+'")');

menuRoot.style.setProperty('--brown-panel','url("'+ASSETS.brownPanel+'")');menuRoot.style.setProperty('--brown-ribbon','url("'+ASSETS.brownRibbon+'")');$('stage').style.setProperty('--prompt-scroll','url("'+ASSETS.promptScroll+'")');
