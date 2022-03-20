const testMembers = [
  { id: 0, name: 'Elijah Sutherland', patrol: 'fox' },
  { id: 1, name: 'Mark Griffin', patrol: 'fox' },
  { id: 2, name: 'Fin Gauss', patrol: 'hawk' },
  { id: 3, name: 'Conner Holowell', patrol: 'hawk' },
  { id: 4, name: 'Colton wasowski', patrol: 'lion' },
  { id: 5, name: 'Collin McGuire-Something', patrol: 'lion' },
]

export async function getMembers() {
  return testMembers;
}