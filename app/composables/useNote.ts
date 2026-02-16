export const useNote = () => {
  const updateStatus = async (noteId: number, status: string) => {
    const res = await $fetch(`/api/notes/${noteId}/update-status`, {
      method: "PUT",
      body: { status },
    });
    return res;
  };

  return {
    updateStatus,
  };
};
