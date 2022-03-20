const testEvents = [
  {id: 0, date: '3/10/2022', name: 'Personal Safety', branch: 'Life Skills', type: 'core'},
  {id: 1, date: '3/17/2022', name: 'Maps Skills', branch: 'Life Skills', type: 'elective'},
  {id: 2, date: '3/19/2022', name: 'Fire Station Tour', branch: 'Life Skills', type: 'htt'},
]

export async function getEvents() {
  return testEvents;
}