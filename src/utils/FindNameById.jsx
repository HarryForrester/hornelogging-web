export function findNameById(idToFind, people, crews) {
  // Find the object with the specified _id
  const person = people && people.find((person) => person._id.toString() === idToFind);
  const crew = crews && crews.find((crew) => crew._id.toString() === idToFind);

  // If person is found, return their name
  if (person && person.name) {
    return person.name;
  } else if (crew && crew.name) {
    // If person is not found, return null or handle accordingly
    return crew.name;
  } else {
    return null;
  }
}
