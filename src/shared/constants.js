/* eslint-disable quote-props */
import FoxesLogo from './images/foxesLogo.png';
import FoxesIcon from './images/fox_head_180.png';
import HawksLogo from './images/hawksLogo.png';
import HawksIcon from './images/hawk_head_180.png';
import MountainLionsLogo from './images/mountainLionsLogo.png';
import MountainLionsIcon from './images/mountain_lion_head_180.png';
import AdventurersLogo from './images/adventuersLogo.png';
import AdventurersIcon from './images/adventuers_logo_180.png';
import NavigatorsLogo from './images/navigatorsLogo.png';
import NavigatorsIcon from './images/navigators_logo_180.png';
import { LESSONS } from './lessons';
import { arrayToObject } from './helpers';

export const USER_ROLES = ['admin', 'trailguide', 'parent'];

export const ADVANCEMENT = {
  'Heritage': { core: 2, elective: 1, htt: 1, makeup: 2 },
  'Hobbies': { core: 1, elective: 2, htt: 1, makeup: 2 },
  'Life Skills': { core: 3, elective: 1, htt: 1, makeup: 2 },
  'Outdoor Skills': { core: 3, elective: 1, htt: 1, makeup: 2 },
  'Science & Technology': { core: 2, elective: 1, htt: 1, makeup: 2 },
  'Sports & Fitness': { core: 2, elective: 1, htt: 1, makeup: 2 },
  'Values': { core: 3, elective: 1, htt: 1, makeup: 2 },
};

export const ADVANCEMENT_BLANK = {
  'Heritage': { core: 0, elective: 0, htt: 0, makeup: 0 },
  'Hobbies': { core: 0, elective: 0, htt: 0, makeup: 0 },
  'Life Skills': { core: 0, elective: 0, htt: 0, makeup: 0 },
  'Outdoor Skills': { core: 0, elective: 0, htt: 0, makeup: 0 },
  'Science & Technology': { core: 0, elective: 0, htt: 0, makeup: 0 },
  'Sports & Fitness': { core: 0, elective: 0, htt: 0, makeup: 0 },
  'Values': { core: 0, elective: 0, htt: 0, makeup: 0 },
};

export const ADV_BADGES_BLANK = {
  'Heritage': { branch: false, star: false },
  'Hobbies': { branch: false, star: false },
  'Life Skills': { branch: false, star: false },
  'Outdoor Skills': { branch: false, star: false },
  'Science & Technology': { branch: false, star: false },
  'Sports & Fitness': { branch: false, star: false },
  'Values': { branch: false, star: false },
};

export const BRANCHES = {
  'Heritage': {
    name: 'Heritage',
    id: 'acvhb63my62f',
    b: '#896400',
    t: 'white',
  },
  'Hobbies': {
    name: 'Hobbies',
    id: 'acn7nd1otizl',
    b: '#212121',
    t: 'white',
  },
  'Life Skills': {
    name: 'Life Skills',
    id: 'ac5takv44649',
    b: '#8c1006',
    t: 'white',
  },
  'Outdoor Skills': {
    name: 'Outdoor Skills',
    id: 'ac9hfgsftr4d',
    b: '#005283',
    t: 'white',
  },
  'Science & Technology': {
    name: 'Science & Technology',
    id: 'acbj0h1vca1j',
    b: '#ffb130',
    t: 'black',
  },
  'Sports & Fitness': {
    name: 'Sports & Fitness',
    id: 'ac9r5nt7904r',
    b: '#425b21',
    t: 'white',
  },
  'Values': {
    name: 'Values',
    id: 'acgn1dpdw6jt',
    b: '#c5171c',
    t: 'white',
  },
};

export const BRANCH_NAMES = Object.keys(BRANCHES);

export const BRANCH_COLORS = {
  // TL Branches
  ...BRANCHES,

  // Other categories to
  'Award': { b: 'purple', t: 'white' },
  'Board': { b: 'lightgray', t: 'black' },
  'Camp': { b: 'yellow', t: 'black' },
  'Day Hike': { b: 'yellow', t: 'black' },
  'Fundraiser': { b: 'limegreen', t: 'black' },
  'General': { b: 'lightgray', t: 'black' },
};

export const EVENT_BRANCHES = Object.keys(BRANCH_COLORS);

export const PATROLS = {
  foxes: {
    id: 'l3c59dc048e8',
    key: 'foxes',
    name: 'Foxes',
    color: '#b97c38',
    logo: FoxesLogo,
    icon: FoxesIcon,
  },
  hawks: {
    id: 'ib6d767d2f8e',
    key: 'hawks',
    name: 'Hawks',
    color: '#eab71b',
    logo: HawksLogo,
    icon: HawksIcon,
  },
  mountainLions: {
    id: 'k37693cfc748',
    key: 'mountainLions',
    name: 'Mountain Lions',
    color: '#cea54a',
    logo: MountainLionsLogo,
    icon: MountainLionsIcon,
  },
  navigators: {
    id: 'j8e296a067a3',
    key: 'navigators',
    name: 'Navigators',
    color: '#bbbdbd',
    logo: NavigatorsLogo,
    icon: NavigatorsIcon,
  },
  adventurers: {
    id: 'x1ff1de77400',
    key: 'adventurers',
    name: 'Adventurers',
    color: '#8ec8e7',
    logo: AdventurersLogo,
    icon: AdventurersIcon,
  }
};

export const PATROLS_ARRAY = Object.values(PATROLS);

export const LESSON_TYPES = {
  'core': 'Core',
  'elective': 'Elective',
  'htt': 'HTT',
  'makeup': 'Makeup',
  'other': 'Other',
};

// restructure LESSONS array into object by ID
const LESSONS_BY_ID = arrayToObject(LESSONS, 'lessonID');

export {
  LESSONS,
  LESSONS_BY_ID
};

// export const LESSONS = {
//   // Heritage
//   1: { id: 1, name: 'Christian Heritage', branch: 'Heritage', type: 'core' },
//   2: { id: 2, name: 'Flag Etiquette and History', branch: 'Heritage', type: 'core' },
//   3: { id: 3, name: 'Founding Fathers', branch: 'Heritage', type: 'core' },
//   4: { id: 4, name: 'My Family', branch: 'Heritage', type: 'core' },
//   5: { id: 5, name: 'My Community', branch: 'Heritage', type: 'elective' },
//   6: { id: 6, name: 'Early America', branch: 'Heritage', type: 'elective' },
//   7: { id: 7, name: 'National Symbols', branch: 'Heritage', type: 'elective' },
//   8: { id: 8, name: 'Armed Forces', branch: 'Heritage', type: 'elective' },
//   9: { id: 9, name: 'American Culture', branch: 'Heritage', type: 'elective' },
//   10: { id: 10, name: 'My State', branch: 'Heritage', type: 'elective' },
//   11: { id: 11, name: 'Hit the Trail! Activity', branch: 'Heritage', type: 'htt' },
//   12: { id: 12, name: 'At Home Makeup Activity', branch: 'Heritage', type: 'makeup' },

//   // Hobbies
//   13: { id: 13, name: 'General Hobbies', branch: 'Hobbies', type: 'core' },
//   14: { id: 14, name: 'Elective 1', branch: 'Hobbies', type: 'elective' },
//   15: { id: 15, name: 'Elective 2', branch: 'Hobbies', type: 'elective' },
//   16: { id: 16, name: 'Hit the Trail! Activity', branch: 'Hobbies', type: 'htt' },
//   17: { id: 17, name: 'At Home Makeup Activity', branch: 'Hobbies', type: 'makeup' },

//   // Life Skills
//   18: { id: 18, name: 'First Aid - Traumatic', branch: 'Life Skills', type: 'core' },
//   19: { id: 19, name: 'First Aid - Medical', branch: 'Life Skills', type: 'core' },
//   20: { id: 20, name: 'Map Skills', branch: 'Life Skills', type: 'core' },
//   21: { id: 21, name: 'Personal Safety', branch: 'Life Skills', type: 'core' },
//   22: { id: 22, name: 'Stewardship', branch: 'Life Skills', type: 'core' },
//   23: { id: 23, name: 'Manners', branch: 'Life Skills', type: 'core' },
//   24: { id: 24, name: 'Water Safety', branch: 'Life Skills', type: 'elective' },
//   25: { id: 25, name: 'Home Maintenance', branch: 'Life Skills', type: 'elective' },
//   26: { id: 26, name: 'Animal Care', branch: 'Life Skills', type: 'elective' },
//   27: { id: 27, name: 'Gardening', branch: 'Life Skills', type: 'elective' },
//   28: { id: 28, name: 'Indoor Cooking', branch: 'Life Skills', type: 'elective' },
//   29: { id: 29, name: 'Repairs', branch: 'Life Skills', type: 'elective' },
//   30: { id: 30, name: 'Hit the Trail! Activity', branch: 'Life Skills', type: 'htt' },
//   31: { id: 31, name: 'At Home Makeup Activity', branch: 'Life Skills', type: 'makeup' },

//   // Outdoor Skills
//   32: { id: 32, name: 'Ropes & Knots', branch: 'Outdoor Skills', type: 'core' },
//   33: { id: 33, name: 'Orienteering', branch: 'Outdoor Skills', type: 'core' },
//   34: { id: 34, name: 'Outddor Cooking', branch: 'Outdoor Skills', type: 'core' },
//   35: { id: 35, name: 'Camping & Hiking', branch: 'Outdoor Skills', type: 'core' },
//   36: { id: 36, name: 'Edge Tools', branch: 'Outdoor Skills', type: 'core' },
//   37: { id: 37, name: 'Fire Safety', branch: 'Outdoor Skills', type: 'core' },
//   38: { id: 38, name: 'Fishing', branch: 'Outdoor Skills', type: 'elective' },
//   39: { id: 39, name: 'Tread Lightly!', branch: 'Outdoor Skills', type: 'elective' },
//   40: { id: 40, name: 'Tracking', branch: 'Outdoor Skills', type: 'elective' },
//   41: { id: 41, name: 'Communication/Signaling', branch: 'Outdoor Skills', type: 'elective' },
//   42: { id: 42, name: 'Hit the Trail! Activity', branch: 'Outdoor Skills', type: 'htt' },
//   43: { id: 43, name: 'At Home Makeup Activity', branch: 'OutdoorSkills', type: 'makeup' },

//   // Science & Technology
//   44: { id: 44, name: 'Know Your Environment', branch: 'Science & Technology', type: 'core' },
//   45: { id: 45, name: 'Science in Weather', branch: 'Science & Technology', type: 'core' },
//   46: { id: 46, name: 'Simple Tools and Machines', branch: 'Science & Technology', type: 'core' },
//   47: { id: 47, name: 'Astronomy', branch: 'Science & Technology', type: 'core' },
//   48: { id: 48, name: 'Rocketry', branch: 'Science & Technology', type: 'elective' },
//   49: { id: 49, name: 'Ancient Weapons', branch: 'Science & Technology', type: 'elective' },
//   50: { id: 50, name: 'Improvised Tools', branch: 'Science & Technology', type: 'elective' },
//   51: { id: 51, name: 'Botany', branch: 'Science & Technology', type: 'elective' },
//   52: { id: 52, name: 'Hit the Trail! Activity', branch: 'Science & Technology', type: 'htt' },
//   53: { id: 53, name: 'At Home Makeup Activity', branch: 'Science & Technology', type: 'makeup' },

//   // Sports and Fitness
//   54: { id: 54, name: 'Nutrition & Fitness', branch: 'Sports & Fitness', type: 'core' },
//   55: { id: 55, name: 'Learn about Sports', branch: 'Sports & Fitness', type: 'core' },
//   56: { id: 56, name: 'Uncommon Sports', branch: 'Sports & Fitness', type: 'elective' },
//   57: { id: 57, name: 'Soccor', branch: 'Sports & Fitness', type: 'elective' },
//   58: { id: 58, name: 'Bowling', branch: 'Sports & Fitness', type: 'elective' },
//   59: { id: 59, name: 'Swimming', branch: 'Sports & Fitness', type: 'elective' },
//   60: { id: 60, name: 'Hit the Trail! Activity', branch: 'Sports & Fitness', type: 'htt' },
//   61: { id: 61, name: 'At Home Makeup Activity', branch: 'Sports & Fitness', type: 'makeup' },

//   // Values
//   62: { id: 62, name: 'Godly Values', branch: 'Values', type: 'core' },
//   63: { id: 63, name: 'Our Faith', branch: 'Values', type: 'core' },
//   64: { id: 64, name: 'Godly Citizenship', branch: 'Values', type: 'core' },
//   65: { id: 65, name: 'Service', branch: 'Values', type: 'core' },
//   66: { id: 66, name: 'Teamwork', branch: 'Values', type: 'core' },
//   67: { id: 67, name: 'Truthfulness/Integrity', branch: 'Values', type: 'core' },
//   68: { id: 68, name: 'Courage', branch: 'Values', type: 'elective' },
//   69: { id: 69, name: 'Obedience', branch: 'Values', type: 'elective' },
//   70: { id: 70, name: 'Righteousness', branch: 'Values', type: 'elective' },
//   71: { id: 71, name: 'Wisdom', branch: 'Values', type: 'elective' },
//   72: { id: 72, name: 'Dedication', branch: 'Values', type: 'elective' },
//   73: { id: 73, name: 'Repentance', branch: 'Values', type: 'elective' },
//   74: { id: 74, name: 'Respect Life', branch: 'Values', type: 'elective' },
//   75: { id: 75, name: 'Hit the Trail! Activity', branch: 'Values', type: 'htt' },
//   76: { id: 76, name: 'At Home Makeup Activity', branch: 'Values', type: 'makeup' },
// };
