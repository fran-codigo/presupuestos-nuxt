export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  return  user;
});
