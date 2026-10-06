const base = { confirmButtonColor: "#4f46e5" };

// SweetAlert2 dimuat saat dialog pertama dibutuhkan (bukan di bundle awal)
const fire = async (options) => {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire({ ...base, ...options });
};

export const showSuccessDialog = (message) =>
  fire({ icon: "success", title: "Berhasil", text: message });

export const showErrorDialog = (message) =>
  fire({ icon: "error", title: "Gagal", text: message });

export const showWarningDialog = (message) =>
  fire({ icon: "warning", title: "Perhatian", text: message });

export async function showConfirmDialog(message, confirmText = "Ya") {
  const result = await fire({
    icon: "question",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
}

export const formatDate = (value) =>
  new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Mengambil baris data dari respons statistik (array langsung / objek berisi array)
export const extractRows = (data) =>
  Array.isArray(data) ? data : Object.values(data ?? {}).find(Array.isArray) ?? [];

export const getAuthorName = (item) => item.author?.name ?? item.name ?? "Pengguna";

export const STATUS_LABEL = { lost: "Hilang", found: "Ditemukan" };

export const pct = (value, total) => (total ? Math.round((value / total) * 100) : 0);

export const STATUS_STYLE = {
  lost: "bg-rose-100 text-rose-700",
  found: "bg-emerald-100 text-emerald-700",
};
