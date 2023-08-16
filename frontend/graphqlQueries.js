const get_drawings = `
query {
  drawings {
    label
    features
  }
}
`;

const ADD_DRAWINGS = `
mutation AddUserDrawings($input: DrawingsInput!) {
  addUserDrawings(input: $input)
}
`;
