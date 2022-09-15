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

export const LESSONS = {
  // Heritage
  1: { name: 'Christian Heritage', branch: 'Heritage', type: 'core' },
  2: { name: 'Flag Etiquette and History', branch: 'Heritage', type: 'core' },
  3: { name: 'Founding Fathers', branch: 'Heritage', type: 'core' },
  4: { name: 'My Family', branch: 'Heritage', type: 'core' },
  5: { name: 'My Community', branch: 'Heritage', type: 'elective' },
  6: { name: 'Early America', branch: 'Heritage', type: 'elective' },
  7: { name: 'National Symbols', branch: 'Heritage', type: 'elective' },
  8: { name: 'Armed Forces', branch: 'Heritage', type: 'elective' },
  9: { name: 'American Culture', branch: 'Heritage', type: 'elective' },
  10: { name: 'My State', branch: 'Heritage', type: 'elective' },
  11: { name: 'Hit the Trail! Activity', branch: 'Heritage', type: 'htt' },
  12: { name: 'At Home Makeup Activity', branch: 'Heritage', type: 'makeup' },

  // Hobbies
  13: { name: 'General Hobbies', branch: 'Hobbies', type: 'core' },
  14: { name: 'Elective 1', branch: 'Hobbies', type: 'elective' },
  15: { name: 'Elective 2', branch: 'Hobbies', type: 'elective' },
  16: { name: 'Hit the Trail! Activity', branch: 'Hobbies', type: 'htt' },
  17: { name: 'At Home Makeup Activity', branch: 'Hobbies', type: 'makeup' },

  // Life Skills
  18: { name: 'First Aid - Traumatic', branch: 'Life Skills', type: 'core' },
  19: { name: 'First Aid - Medical', branch: 'Life Skills', type: 'core' },
  20: { name: 'Map Skills', branch: 'Life Skills', type: 'core' },
  21: { name: 'Personal Safety', branch: 'Life Skills', type: 'core' },
  22: { name: 'Stewardship', branch: 'Life Skills', type: 'core' },
  23: { name: 'Manners', branch: 'Life Skills', type: 'core' },
  24: { name: 'Water Safety', branch: 'Life Skills', type: 'elective' },
  25: { name: 'Home Maintenance', branch: 'Life Skills', type: 'elective' },
  26: { name: 'Animal Care', branch: 'Life Skills', type: 'elective' },
  27: { name: 'Gardening', branch: 'Life Skills', type: 'elective' },
  28: { name: 'Indoor Cooking', branch: 'Life Skills', type: 'elective' },
  29: { name: 'Repairs', branch: 'Life Skills', type: 'elective' },
  30: { name: 'Hit the Trail! Activity', branch: 'Life Skills', type: 'htt' },
  32: { name: 'At Home Makeup Activity', branch: 'Life Skills', type: 'makeup' },

  // Outdoor Skills
  33: { name: 'Ropes & Knots', branch: 'Outdoor Skills', type: 'core' },
  34: { name: 'Orienteering', branch: 'Outdoor Skills', type: 'core' },
  35: { name: 'Outddor Cooking', branch: 'Outdoor Skills', type: 'core' },
  36: { name: 'Camping & Hiking', branch: 'Outdoor Skills', type: 'core' },
  37: { name: 'Edge Tools', branch: 'Outdoor Skills', type: 'core' },
  38: { name: 'Fire Safety', branch: 'Outdoor Skills', type: 'core' },
  39: { name: 'Fishing', branch: 'Outdoor Skills', type: 'elective' },
  40: { name: 'Tread Lightly!', branch: 'Outdoor Skills', type: 'elective' },
  41: { name: 'Tracking', branch: 'Outdoor Skills', type: 'elective' },
  42: { name: 'Communication/Signaling', branch: 'Outdoor Skills', type: 'elective' },
  43: { name: 'Hit the Trail! Activity', branch: 'Outdoor Skills', type: 'htt' },
  44: { name: 'At Home Makeup Activity', branch: 'OutdoorSkills', type: 'makeup' },

  // Science & Technology
  45: { name: 'Know Your Environment', branch: 'Science & Technology', type: 'core' },
  46: { name: 'Science in Weather', branch: 'Science & Technology', type: 'core' },
  47: { name: 'Simple Tools and Machines', branch: 'Science & Technology', type: 'core' },
  48: { name: 'Astronomy', branch: 'Science & Technology', type: 'core' },
  49: { name: 'Rocketry', branch: 'Science & Technology', type: 'elective' },
  50: { name: 'Ancient Weapons', branch: 'Science & Technology', type: 'elective' },
  51: { name: 'Improvised Tools', branch: 'Science & Technology', type: 'elective' },
  52: { name: 'Botany', branch: 'Science & Technology', type: 'elective' },
  53: { name: 'Hit the Trail! Activity', branch: 'Science & Technology', type: 'htt' },
  54: { name: 'At Home Makeup Activity', branch: 'Science & Technology', type: 'makeup' },

  // Sports and Fitness
  55: { name: 'Nutrition & Fitness', branch: 'Sports & Fitness', type: 'core' },
  56: { name: 'Learn about Sports', branch: 'Sports & Fitness', type: 'core' },
  57: { name: 'Uncommon Sports', branch: 'Sports & Fitness', type: 'elective' },
  58: { name: 'Soccor', branch: 'Sports & Fitness', type: 'elective' },
  59: { name: 'Bowling', branch: 'Sports & Fitness', type: 'elective' },
  60: { name: 'Swimming', branch: 'Sports & Fitness', type: 'elective' },
  61: { name: 'Hit the Trail! Activity', branch: 'Sports & Fitness', type: 'htt' },
  62: { name: 'At Home Makeup Activity', branch: 'Sports & Fitness', type: 'makeup' },

  // Values
  63: { name: 'Godly Values', branch: 'Values', type: 'core' },
  64: { name: 'Our Faith', branch: 'Values', type: 'core' },
  65: { name: 'Godly Citizenship', branch: 'Values', type: 'core' },
  66: { name: 'Service', branch: 'Values', type: 'core' },
  67: { name: 'Teamwork', branch: 'Values', type: 'core' },
  68: { name: 'Truthfulness/Integrity', branch: 'Values', type: 'core' },
  69: { name: 'Courage', branch: 'Values', type: 'elective' },
  70: { name: 'Obedience', branch: 'Values', type: 'elective' },
  71: { name: 'Righteousness', branch: 'Values', type: 'elective' },
  72: { name: 'Wisdom', branch: 'Values', type: 'elective' },
  73: { name: 'Dedication', branch: 'Values', type: 'elective' },
  74: { name: 'Repentance', branch: 'Values', type: 'elective' },
  75: { name: 'Respect Life', branch: 'Values', type: 'elective' },
  76: { name: 'Hit the Trail! Activity', branch: 'Values', type: 'htt' },
  77: { name: 'At Home Makeup Activity', branch: 'Values', type: 'makeup' },
};
