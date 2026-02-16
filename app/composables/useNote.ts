export const useNote = () => {
  const create = async (data: any) => {
    return await $fetch("/api/notes", {
      method: "POST",
      body: data,
    });
  };

  const deleteNote = async (noteId: number) => {
    const res = await $fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    });
    return res;
  };

  const updateNote = async (noteId: number, data: any) => {
    const res = await $fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      body: data,
    });
    return res;
  };

  const updateStatus = async (noteId: number, status: string) => {
    const res = await $fetch(`/api/notes/${noteId}/update-status`, {
      method: "PUT",
      body: { status },
    });
    return res;
  };

  return {
    create,
    deleteNote,
    updateNote,
    updateStatus,
  };
};
