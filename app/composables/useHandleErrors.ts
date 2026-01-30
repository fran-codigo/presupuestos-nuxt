import type { FetchError } from "ofetch";

export const useHandleErrors = () => {
  const handleErrors = (
    toast,
    error: unknown,
    defaultMessage = "Hubo un error",
  ) => {
    const fetchErr = error as FetchError;

    // Si hay un array de errores de validación
    if (fetchErr?.data?.data && Array.isArray(fetchErr.data.data)) {
      fetchErr.data.data.forEach((errorMsg: string) => {
        toast.error({
          message: errorMsg,
        });
      });
    }
    // Si hay un mensaje único de error
    else if (fetchErr?.data?.message) {
      toast.error({
        message: fetchErr.data.message,
      });
    }
    // Fallback genérico
    else {
      toast.error({
        message: defaultMessage,
      });
    }
  };

  return {
    handleErrors,
  };
};
