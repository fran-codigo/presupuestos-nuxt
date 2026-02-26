export const useNote = () => {
  const create = async (data: any) => {
    return await $fetch("/api/notes", {
      method: "POST",
      body: data,
    });
  };

  const deleteNote = async (noteId: number) => {
    return await $fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    });
  };

  const updateNote = async (noteId: number, data: any) => {
    return await $fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      body: data,
    });
  };

  const updateStatus = async (noteId: number, status: string) => {
    return await $fetch(`/api/notes/${noteId}/update-status`, {
      method: "PUT",
      body: { status },
    });
  };

  return {
    create,
    deleteNote,
    updateNote,
    updateStatus,
  };
};
