import { IG } from '../types';
import { resolveTrick, getSortedDeck, cmpCards } from '../game';
import * as util from '../util/misc';
import * as u_placement from '../util/placement';

// helper functions to generate (random) test cases
/* Example:
import { playRandomTricks, dealCards } from './gen';
  for (let N = 0; N < 1000; N++) {
    const G = setup_4players();
    dealCards(G);
    playRandomTricks(G);
    const summary = getRoundSummary(G);
    if (summary.petitAuBout > 0 && summary.slam > 0) {
      console.log(summary);
      console.log(G.resolvedTricks.slice(1).map(trick2str));
      console.log(G.deck.map(card2str).join(' '));
      break;
    }
  }
*/

export function playRandomTricks(G: IG) {
  const numTricks = G.players[0].hand.length;
  const numPlayers = G.players.length;
  for (let i = 0; i < numTricks; i++) {
    const leader = G.trick.leader;
    for (let j = 0; j < numPlayers; j++) {
      const player = G.players[util.mod(+leader.id + j, numPlayers)];
      const sel_bool = u_placement.selectableCards(G, player.id);
      const sel_id = sel_bool.map((_, i) => i).filter((i) => sel_bool[i]);
      const i_card = sel_id[(sel_id.length * Math.random()) | 0];
      G.trick.cards.push(player.hand.splice(i_card, 1)[0]);
    }
    resolveTrick(G);
  }
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function dealCards(G: IG) {
  const handSize = util.handSize(G.players.length);
  G.deck = getSortedDeck();
  shuffleArray(G.deck);
  G.players.forEach((P, i) => {
    P.hand = G.deck.slice(i * handSize, (i + 1) * handSize).sort(cmpCards);
  });
  G.kitty = G.deck.slice(-util.kittySize(G.players.length)).sort(cmpCards);
}
