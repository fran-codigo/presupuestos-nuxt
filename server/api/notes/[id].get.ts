import { validateNoteOwnership } from '~~/server/utils/note';

export default eventHandler(async (event) => {
  const { note } = await validateNoteOwnership(event);

  return note;
});
