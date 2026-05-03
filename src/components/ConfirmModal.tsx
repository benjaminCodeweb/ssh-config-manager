export interface Props {
    message: string,
    onConfirm: () => void;
    onCancel: () =>  void;
}

export default function ConfirmModal({message, onConfirm, onCancel}: Props) {
return (
     <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <h2 className="font-mono text-white font-semibold">¿Confirmar eliminación?</h2>
          <p className="font-mono text-sm text-gray-400">{message}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="font-mono text-sm px-4 py-2 border border-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >Cancelar</button>
          <button
            onClick={onConfirm}
            className="font-mono text-sm px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors"
          >Eliminar</button>
        </div>
      </div>
    </div>
)
}