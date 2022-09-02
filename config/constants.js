/* eslint-disable quote-props */
import FoxesLogo from '../images/foxesLogo.png';
import HawksLogo from '../images/hawksLogo.png';
import MountainLionsLogo from '../images/mountainLionsLogo.png';
import AdventurersLogo from '../images/adventuersLogo.png';
import NavigatorsLogo from '../images/navigatorsLogo.png';

export const EVENT_TYPES = [
  'Core',
  'Elective',
  'HTT',
  'Other',
];

export const ADVANCEMENT = {
  'Heritage': { core: 2, elective: 1, htt: 1 },
  'Hobbies': { core: 1, elective: 2, htt: 1 },
  'Life Skills': { core: 3, elective: 1, htt: 1 },
  'Outdoor Skills': { core: 3, elective: 1, htt: 1 },
  'Science/Tech': { core: 2, elective: 1, htt: 1 },
  'Sports/Fitness': { core: 2, elective: 1, htt: 1 },
  'Values': { core: 2, elective: 1, htt: 1 },
};

export const BRANCHES = [
  ...Object.keys(ADVANCEMENT),
  'Award',
  'Board',
  'Camp',
  'Fundraiser',
  'General',
  'Day Hike',
];

export const BRANCH_COLORS = {
  'Heritage': { b: '#896400', t: 'white' },
  'Hobbies': { b: '#212121', t: 'white' },
  'Life Skills': { b: '#8c1006', t: 'white' },
  'Outdoor Skills': { b: '#005283', t: 'white' },
  'Science/Tech': { b: '#ffb130', t: 'black' },
  'Sports/Fitness': { b: '#425b21', t: 'white' },
  'Values': { b: '#c5171c', t: 'white' },
  'Award': { b: 'purple', t: 'white' },
  'Board': { b: 'lightgray', t: 'black' },
  'Camp': { b: 'yellow', t: 'black' },
  'Day Hike': { b: 'yellow', t: 'black' },
  'Fundraiser': { b: 'limegreen', t: 'black' },
  'General': { b: 'lightgray', t: 'black' },
};

export const PATROLS = [
  'Foxes',
  'Hawks',
  'Mountain Lions',
  'Navigators',
  'Adventurers',
];

export const PATROL_COLORS = {
  'Foxes': '#b97c38',
  'Hawks': '#eab71b',
  'Mountain Lions': '#cea54a',
  'Navigators': '#bbbdbd',
  'Adventurers': '#8ec8e7',
};

export const PATROL_LOGOS = {
  'Foxes': FoxesLogo,
  'Hawks': HawksLogo,
  'Mountain Lions': MountainLionsLogo,
  'Adventurers': AdventurersLogo,
  'Navigators': NavigatorsLogo,
};
