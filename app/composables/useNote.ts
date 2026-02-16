export const useNote = () => {
  const create = async (data: any) => {
    const res = await $fetch("/api/notes", {
      method: "POST",
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
    updateStatus,
  };
};
