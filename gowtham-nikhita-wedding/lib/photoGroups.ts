import type { PhotoGroup } from './types'

export const PHOTO_GROUPS: PhotoGroup[] = [
  {
    index: 0,
    name: 'Bride & Groom',
    description: 'Just the two of you — portraits and intimate shots.',
    members: ['Gowtham', 'Nikhita'],
  },
  {
    index: 1,
    name: "Groom's Immediate Family",
    description: 'Parents and siblings of the groom.',
    members: ['Gowtham', 'Nikhita', "Groom's Parents", "Groom's Siblings"],
  },
  {
    index: 2,
    name: "Bride's Immediate Family",
    description: 'Parents and siblings of the bride.',
    members: ['Gowtham', 'Nikhita', "Bride's Parents", "Bride's Siblings"],
  },
  {
    index: 3,
    name: 'Both Immediate Families',
    description: 'All parents and siblings together.',
    members: ['Bride & Groom', "Both sets of parents", 'All siblings'],
  },
  {
    index: 4,
    name: "Groom's Extended Family",
    description: 'Aunts, uncles, and cousins on the groom\'s side.',
    members: ["Groom's side extended family"],
  },
  {
    index: 5,
    name: "Bride's Extended Family",
    description: 'Aunts, uncles, and cousins on the bride\'s side.',
    members: ["Bride's side extended family"],
  },
  {
    index: 6,
    name: 'Full Bridal Party',
    description: 'All bridesmaids and groomsmen together.',
    members: ['All bridesmaids', 'All groomsmen'],
  },
  {
    index: 7,
    name: 'Bridesmaids Only',
    description: 'Bride with all her bridesmaids.',
    members: ['Nikhita', 'All bridesmaids'],
  },
  {
    index: 8,
    name: 'Groomsmen Only',
    description: 'Groom with all his groomsmen.',
    members: ['Gowtham', 'All groomsmen'],
  },
  {
    index: 9,
    name: 'College Friends',
    description: 'College crew — you know who you are.',
    members: ['College friends group'],
  },
  {
    index: 10,
    name: 'Work Friends & Colleagues',
    description: 'The professional network that became family.',
    members: ['Work friends & colleagues'],
  },
  {
    index: 11,
    name: 'Full Wedding Party',
    description: 'Everyone together — the grand finale shot!',
    members: ['All guests & wedding party'],
  },
]
