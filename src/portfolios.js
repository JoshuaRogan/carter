// Central registry of all portfolios and their stocks JSON
// Each portfolio entry: { id, name, family, color, data }
import bradleyStocks from './bradleyStocks.json';
import andrewStocks from './andrewStocks.json';
import carterStocks from './carterStocks.json';
import reaganStocks from './reaganStocks.json';
import patrickStocks from './patrickStocks.json';
import oliviaStocks from './oliviaStocks.json';
import trinityStocks from './trinityStocks.json';
import grantStocks from './grantStocks.json';
import giulaStocks from './giuliaStocks.json';
import { FAMILIES } from './env';

export const portfolios = [
  { id: 'reagan', name: "Reagan", family: FAMILIES.ROGAN, color: '#e67e22', data: reaganStocks },
  { id: 'patrick', name: "Patrick", family: FAMILIES.ROGAN, color: '#16a085', data: patrickStocks },

  { id: 'carter', name: "Carter", family: FAMILIES.NOLE, color: '#3498db', data: carterStocks },
  { id: 'bradley', name: "Bradley", family: FAMILIES.NOLE, color: '#9b59b6', data: bradleyStocks },
  { id: 'andrew', name: "Andrew", family: FAMILIES.NOLE, color: '#2ecc71', data: andrewStocks },

  { id: 'olivia', name: "Olivia", family: FAMILIES.KERRIGAN, color: '#c0392b', data: oliviaStocks },
  { id: 'grant', name: "Grant", family: FAMILIES.KERRIGAN, color: '#8e44ad', data: grantStocks },
  { id: 'trinity', name: "Trinity", family: FAMILIES.KERRIGAN, color: '#27ae60', data: trinityStocks },
  { id: 'giulia', name: "Giulia", family: FAMILIES.TOKASH, color: '#c34427', data: giulaStocks },
];

export function getPortfolioById(id) {
  return portfolios.find(p => p.id === id);
}

